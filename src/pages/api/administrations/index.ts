import { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, PrismaClient } from '@prisma/client';
import { isValidObjectId } from '@/utils/tools';

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
	if (req.method !== 'GET') {
		return res.status(400).json({ message: 'Unsupported method' });
	}

	const { editionId } = req.query;
	if (editionId !== undefined && !isValidObjectId(editionId)) {
		return res.status(400).json({ message: 'Invalid editionId' });
	}

	try {
		const administrations = await getAdministrations(
			typeof editionId === 'string' ? editionId : undefined
		);
		return res.status(200).json(administrations);
	} catch (err) {
		console.error('GET /api/administrations failed:', err);
		return res.status(500).json({ message: 'Internal error' });
	}
}
