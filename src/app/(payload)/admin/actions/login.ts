'use server';

import payloadConfig from '@payload-config';
import { getPayload } from 'payload';
import { cookies } from 'next/headers';
import { checkAdminCredentials, loginAdmin } from '@/payload/auth/adminLogin';
import { getAuthCookieMaxAge, getAuthCookieOptions } from '@/utils/auth-cookie';

const getField = (formData: FormData, name: string) => {
	const value = formData.get(name);
	return typeof value === 'string' ? value : '';
};

export async function login(_: any, formData: FormData) {
	const payload = await getPayload({
		config: payloadConfig
	});

	try {
		const user = await loginAdmin(payload, {
			email: getField(formData, 'email'),
			password: getField(formData, 'password'),
			totp: getField(formData, 'totp')
		});

		if (!user.token) throw new Error('Missing token');

		const cookiesHelpers = await cookies();
		cookiesHelpers.set(
			`${payload.config.cookiePrefix}-token`,
			user.token,
			getAuthCookieOptions(getAuthCookieMaxAge(user.exp))
		);

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

type CheckOTPState = {
	success: boolean;
	error: boolean;
	hasOTP: boolean;
	otpauthUri?: string;
	message: string;
};

const INVALID_CREDENTIALS: CheckOTPState = {
	success: false,
	error: true,
	hasOTP: false,
	message: 'Identifiants incorrects'
};

export async function checkOTP(
	_: any,
	formData: FormData
): Promise<CheckOTPState> {
	const payload = await getPayload({
		config: payloadConfig
	});

	try {
		const result = await checkAdminCredentials(payload, {
			email: getField(formData, 'email'),
			password: getField(formData, 'password')
		});

		if (!result.ok) return INVALID_CREDENTIALS;

		return {
			success: true,
			error: false,
			hasOTP: result.hasOTP,
			...(result.hasOTP ? {} : { otpauthUri: result.otpauthUri }),
			message: 'ok'
		};
	} catch (e) {
		return INVALID_CREDENTIALS;
	}
}
