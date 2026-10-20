import * as OTPAuth from 'otpauth';
import { incrementLoginAttempts, type Payload, type TypedUser } from 'payload';

export const ADMINS_SLUG = 'payload-admins';

const TOTP_ISSUER = 'Vos démarches essentielles';
const TOTP_PERIOD = 30;
const TOTP_DIGITS = 6;

export const TOTP_PHASE_CREDENTIALS = 'credentials';

export type TotpContext = {
	totp?: unknown;
	totpPhase?: typeof TOTP_PHASE_CREDENTIALS;
};

const TOTP_CHALLENGE_ERROR_NAME = 'TotpChallengeError';

// Reconnue par son name et non instanceof : hook et appelant peuvent être dans des bundles distincts
export class TotpChallengeError extends Error {
	readonly userId: string | number;
	readonly email: string;
	readonly hasOTP: boolean;

	constructor(args: {
		userId: string | number;
		email: string;
		hasOTP: boolean;
	}) {
		super('TOTP challenge');
		this.name = TOTP_CHALLENGE_ERROR_NAME;
		this.userId = args.userId;
		this.email = args.email;
		this.hasOTP = args.hasOTP;
	}
}

export const isTotpChallengeError = (
	error: unknown
): error is TotpChallengeError =>
	error instanceof Error && error.name === TOTP_CHALLENGE_ERROR_NAME;

export const createTotp = (label: string, secret?: string) =>
	new OTPAuth.TOTP({
		issuer: TOTP_ISSUER,
		label,
		algorithm: 'SHA1',
		digits: TOTP_DIGITS,
		period: TOTP_PERIOD,
		...(secret ? { secret: OTPAuth.Secret.fromBase32(secret) } : {})
	});

export const verifyTotpCode = ({
	secret,
	token,
	label,
	lastCounter
}: {
	secret: string | null | undefined;
	token: unknown;
	label: string;
	lastCounter: number | null | undefined;
}): number | null => {
	if (!secret || typeof token !== 'string') return null;

	const code = token.trim();
	if (!/^\d{6}$/.test(code)) return null;

	let totp: OTPAuth.TOTP;
	try {
		totp = createTotp(label, secret);
	} catch {
		return null;
	}

	const now = Date.now();
	const delta = totp.validate({ token: code, timestamp: now, window: 1 });
	if (delta === null) return null;

	const counter = totp.counter({ timestamp: now }) + delta;
	if (typeof lastCounter === 'number' && counter <= lastCounter) return null;

	return counter;
};

// Appelé dans la transaction du login : une écriture avec req serait annulée, une écriture
// attendue sans req bloquerait sur le verrou de ligne. Lancée hors transaction, sans await.
export const recordTotpFailure = (payload: Payload, user: TypedUser) => {
	const collection = payload.collections[ADMINS_SLUG]?.config;
	if (!collection?.auth?.maxLoginAttempts) return;

	incrementLoginAttempts({
		collection,
		payload,
		user: { ...user }
	}).catch(err => {
		payload.logger.error({
			err,
			msg: 'Échec du comptage de la tentative TOTP'
		});
	});
};
