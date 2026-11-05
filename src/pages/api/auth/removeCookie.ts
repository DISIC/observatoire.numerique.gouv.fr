import { NextApiRequest, NextApiResponse } from 'next';
import { logoutAdminFromRequest } from '@/utils/admin-auth';
import {
	AUTH_COOKIE_NAME,
	serializeExpiredAuthCookie
} from '@/utils/auth-cookie';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST');
		return res.status(405).json({ message: 'Method not allowed' });
	}

	try {
		await logoutAdminFromRequest(req);
	} catch (err) {
		console.error('POST /api/auth/removeCookie: logout failed', err);
	}

	const cookieNames = Array.from(new Set([AUTH_COOKIE_NAME, 'payload-token']));
	res.setHeader('Set-Cookie', cookieNames.map(serializeExpiredAuthCookie));

	return res.status(200).json({ message: 'User token removed' });
}
