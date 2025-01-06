'use server';

import payloadConfig from '@payload-config';
import { getPayload } from 'payload';
import { cookies } from 'next/headers';
import { Options } from 'node_modules/payload/dist/auth/operations/local/login';

export async function login(_: any, formData: FormData) {
	const payload = await getPayload({
		config: payloadConfig
	});

	try {
		const loginData: Options<'payload-admins'> = {
			collection: 'payload-admins',
			data: {
				email: formData.get('email') as string,
				password: formData.get('password') as string
			},
			context: process.env.NODE_ENV === 'development'
				? {}
				: {
					totp: formData.get('totp'),
					totpSecret: formData.get('totpSecret')
				}
		};

		const user = await payload.login(loginData);
		const cookiesHelpers = await cookies();
		cookiesHelpers.set('payload-token', user.token!);

		return {
			success: true,
			error: false
		};
	} catch (e) {
		return {
			error: true,
			success: false
		};
	}
}

export async function checkOTP(_: any, formData: FormData) {
	const payload = await getPayload({
		config: payloadConfig
	});

	try {
		const users = await payload.find({
			collection: 'payload-admins',
			where: {
				email: { equals: formData.get('email') as string }
			}
		});
		const user = users.docs[0];

		return {
			success: true,
			error: false,
			hasOTP: !!user.totpSecret,
			message: 'ok'
		};
	} catch (e) {
		return {
			success: false,
			error: true,
			hasOTP: false,
			message: 'Identifiants incorrects'
		};
	}
}
