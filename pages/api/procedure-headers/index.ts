import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getProcedureHeaders() {
	const procedureheader = await prisma.procedureHeader.findMany({
		orderBy: [{ position: 'asc' }]
	});
	return procedureheader;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		const procedureheaders = await getProcedureHeaders();
		res.status(200).json(procedureheaders);
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
