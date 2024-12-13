// ./src/app/(payload)/admin/login/actions/login.ts
'use server';

import payloadConfig from '@payload-config';
import { getPayload } from 'payload';
import { cookies } from 'next/headers';

export async function login(_: any, formData: FormData) {
	const payload = await getPayload({
		config: payloadConfig
	});

	try {
		const user = await payload.login({
			collection: 'payload-admins',
			data: {
				email: formData.get('email') as string,
				password: formData.get('password') as string
			},
			context: {
				totp: formData.get('totp'),
				totpSecret: formData.get('totpSecret')
			}
		});

		const cookiesHelpers = await cookies();

		cookiesHelpers.set('payload-token', user.token!);
		return {
			success: true,
			error: false
		};
	} catch (e) {
		console.error('Error while login', e);
		return {
			error: true,
			success: false
		};
	}
}
