import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { ProcedureKind } from '../indicator-scores';

const prisma = new PrismaClient();

export async function getProcedureGroupByKind(kind: ProcedureKind) {
	const group = await prisma.procedure.groupBy({
		by: [kind],
	});

	return group.map(group => group[kind]).filter(value => value !== null).sort((a, b) => a.localeCompare(b));
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		if (req.query.kind) {
			const groupByProcedureKind = await getProcedureGroupByKind(
				req.query.kind as ProcedureKind
			);
			res.status(200).json(groupByProcedureKind);
		}
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
