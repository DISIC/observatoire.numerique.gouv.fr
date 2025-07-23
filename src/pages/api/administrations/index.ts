import { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAdministrations(editionId?: string) {
	const where: Prisma.ProcedureWhereInput = {};

	if (editionId) {
		where.editionId = editionId;
	}

	const administrations = await prisma.procedure.groupBy({
		by: ['administration'],
		orderBy: {
			administration: 'asc'
		},
		where
	});

	return administrations.map(administration => administration.administration);
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		const { editionId } = req.query;
		const administrations = await getAdministrations(editionId as string | undefined);
		res.status(200).json(administrations);
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
