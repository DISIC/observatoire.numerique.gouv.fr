import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getDepartments() {
	const departments = await prisma.procedure.groupBy({
		by: ['ministere'],
		orderBy: {
			ministere: 'asc'
		}
	});
	return departments.map(department => department.ministere);
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
		const departments = await getDepartments();
		res.status(200).json(departments);
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
