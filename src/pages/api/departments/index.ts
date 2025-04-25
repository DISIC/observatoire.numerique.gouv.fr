import { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getDepartments(
	kind: 'base' | 'old' = 'base',
	editionId?: string
) {
	const where: Prisma.ProcedureWhereInput = {};

	if (editionId) {
		where.editionId = editionId;
	}

	const departments =
		kind === 'old'
			? await prisma.oldProcedure.groupBy({
					by: ['ministere'],
					orderBy: {
						ministere: 'asc'
					}
			  })
			: await prisma.procedure.groupBy({
					by: ['ministere'],
					where,
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
	if (req.method === 'GET') {
		const { kind, editionId } = req.query;
		const departments = await getDepartments(
			kind as 'base' | 'old',
			editionId as string | undefined
		);
		res.status(200).json(departments);
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
