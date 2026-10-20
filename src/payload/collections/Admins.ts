import {
	AuthenticationError,
	type CollectionConfig,
	type Field
} from 'payload';
import {
	ADMINS_SLUG,
	TOTP_PHASE_CREDENTIALS,
	TotpChallengeError,
	recordTotpFailure,
	verifyTotpCode,
	type TotpContext
} from '../auth/totp';

const hiddenTotpField = (field: Field): Field =>
	({
		...field,
		access: {
			read: () => false,
			create: () => false,
			update: () => false
		},
		admin: {
			position: 'sidebar',
			hidden: true
		}
	} as Field);

export const Admins: CollectionConfig = {
	slug: ADMINS_SLUG,
	labels: {
		singular: 'Administrateur',
		plural: 'Administrateurs'
	},
	admin: {
		useAsTitle: 'email'
	},
	auth: {
		cookies: {
			secure: process.env.NODE_ENV !== 'development',
			sameSite: 'Strict'
		}
	},
	fields: [
		hiddenTotpField({
			name: 'totpSecret',
			type: 'text',
			label: 'Secret TOTP'
		}),
		hiddenTotpField({
			name: 'totpPendingSecret',
			type: 'text',
			label: 'Secret TOTP en attente'
		}),
		hiddenTotpField({
			name: 'totpLastCounter',
			type: 'number',
			label: 'Dernier compteur TOTP utilisé'
		})
	],
	hooks: {
		beforeLogin: [
			async ({ req, user, context }) => {
				const { totp, totpPhase } = (context ?? {}) as TotpContext;

				if (totpPhase === TOTP_PHASE_CREDENTIALS) {
					throw new TotpChallengeError({
						userId: user.id,
						email: user.email,
						hasOTP: Boolean(user.totpSecret)
					});
				}

				// TOTP non vérifié en développement : NODE_ENV=production sur tous les env déployés
				if (process.env.NODE_ENV === 'development') return;

				const secret = user.totpSecret || user.totpPendingSecret;
				const counter = verifyTotpCode({
					secret,
					token: totp,
					label: user.email,
					lastCounter: user.totpLastCounter
				});

				if (counter === null) {
					recordTotpFailure(req.payload, user);
					throw new AuthenticationError(req.t);
				}

				// Avec `req` : écrit dans la transaction du login (validée avec lui).
				await req.payload.db.updateOne({
					collection: ADMINS_SLUG,
					id: user.id,
					data: {
						totpSecret: secret,
						totpPendingSecret: null,
						totpLastCounter: counter
					},
					req,
					returning: false
				});
			}
		]
	}
};
