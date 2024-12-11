import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	res.setHeader('Set-Cookie', [
		`${process.env.NEXT_PUBLIC_JWT_COOKIE_NAME ?? "obs-jwt"}=; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
	]);

	return res.status(200).json({ message: 'User token removed' });
}