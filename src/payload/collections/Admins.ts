import type { CollectionConfig } from 'payload';
import * as OTPAuth from 'otpauth';

export const Admins: CollectionConfig = {
	slug: 'payload-admins',
	labels: {
		singular: 'Administrateur',
		plural: 'Administrateurs'
	},
	admin: {
		useAsTitle: 'email'
	},
	auth: true,
	fields: [
		{
			name: 'totpSecret',
			type: 'text',
			label: 'Secret TOTP',
			admin: {
				position: 'sidebar',
				hidden: true
			}
		}
	],
	hooks: {
		beforeLogin: [
			args => {
				const { email, totpSecret } = args.user;
				const { totp, totpSecret: tmpTotpSecret } = args.context;

				if (process.env.NODE_ENV === 'development') return;

				if (typeof totp !== 'string' || totp.trim().length !== 6) {
					throw new Error('Invalid TOTP');
				}

				let totpHelpers = new OTPAuth.TOTP({
					issuer: 'Vos démarches essentielles',
					label: email,
					algorithm: 'SHA1',
					digits: 6,
					period: 30,
					secret: (totpSecret ? totpSecret : tmpTotpSecret) as string
				});

				if (totpHelpers.validate({ token: totp }) !== 0) {
					throw new Error('Invalid TOTP');
				}

				if (!totpSecret) {
					args.req.payload.update({
						collection: 'payload-admins',
						id: args.user.id,
						data: {
							totpSecret: totpHelpers.secret.base32
						}
					});
				}
			}
		]
	}
};
