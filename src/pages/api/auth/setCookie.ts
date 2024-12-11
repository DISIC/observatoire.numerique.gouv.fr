import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { token, exp } = req.query;

	if (!token || typeof token !== 'string') {
		return res.status(400).json({ message: 'Token is required' });
	}

	if (!exp || typeof exp !== 'string') {
		return res.status(400).json({ message: 'Expiration time is required' });
	}

	const expTimestamp = parseInt(exp);
	if (isNaN(expTimestamp)) {
		return res.status(400).json({ message: 'Invalid expiration time format' });
	}

	const now = Math.floor(Date.now() / 1000);
	const maxAge = expTimestamp - now;

	if (maxAge <= 0) {
		return res.status(400).json({ message: 'Token is already expired' });
	}

	res.setHeader('Set-Cookie', [
		`${process.env.NEXT_PUBLIC_JWT_COOKIE_NAME ?? "obs-jwt"}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`
	]);

	return res.status(200).json({ message: 'Token set successfully' });
}