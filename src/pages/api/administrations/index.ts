import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAdministrations() {
	const administrations = await prisma.procedure.groupBy({
		by: ['administration'],
		orderBy: {
			administration: 'asc'
		}
	});
	return administrations.map(administration => administration.administration);
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (['POST', 'PUT', 'DELETE'].includes(req.method || '')) {
		const jwtCookie =
			req.cookies[process.env.NEXT_PUBLIC_JWT_COOKIE_NAME ?? 'obs-jwt'];
		if (!jwtCookie) {
			return res.status(401).json({ msg: 'You shall not pass.' });
		}
	}

	if (req.method === 'GET') {
		const administrations = await getAdministrations();
		res.status(200).json(administrations);
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
