import type { Payload } from 'payload';
import {
	ADMINS_SLUG,
	TOTP_PHASE_CREDENTIALS,
	createTotp,
	isTotpChallengeError,
	type TotpContext
} from './totp';

export type CredentialsCheckResult =
	| { ok: false }
	| { ok: true; hasOTP: true }
	| { ok: true; hasOTP: false; otpauthUri: string };

export async function checkAdminCredentials(
	payload: Payload,
	{ email, password }: { email: string; password: string }
): Promise<CredentialsCheckResult> {
	if (!email || !password) return { ok: false };

	try {
		const context: TotpContext = { totpPhase: TOTP_PHASE_CREDENTIALS };
		await payload.login({
			collection: ADMINS_SLUG,
			data: { email, password },
			context
		});
		return { ok: false };
	} catch (error) {
		if (!isTotpChallengeError(error)) return { ok: false };

		if (error.hasOTP) return { ok: true, hasOTP: true };

		// La transaction du login est annulée à ce stade : écriture directe.
		// Un nouveau secret à chaque passage invalide les QR codes précédents.
		const totp = createTotp(error.email);
		await payload.db.updateOne({
			collection: ADMINS_SLUG,
			id: error.userId,
			data: { totpPendingSecret: totp.secret.base32 },
			returning: false
		});

		return { ok: true, hasOTP: false, otpauthUri: totp.toString() };
	}
}

export async function loginAdmin(
	payload: Payload,
	{ email, password, totp }: { email: string; password: string; totp: string }
) {
	const context: TotpContext = { totp };
	return payload.login({
		collection: ADMINS_SLUG,
		data: { email, password },
		context
	});
}
