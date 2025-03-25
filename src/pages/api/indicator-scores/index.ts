import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getIndicatorScoresByProcedureKind } from '@/utils/data-viz';

export type ProcedureKind =
	| 'administration'
	| 'administration_central'
	| 'ministere';

const prisma = new PrismaClient();

export async function getIndicatorScores(kind: ProcedureKind) {
	const elementGroupedByProcedureKind = await prisma.procedure.groupBy({
		by: [kind],
		_count: true
	});

	const groupByKind = elementGroupedByProcedureKind
		.filter(element => element[kind])
		.map(element => ({
			text: element[kind] as string,
			_count: element._count
		}));

	const records = await getIndicatorScoresByProcedureKind({
		kind,
		groupByKind
	});

	return records;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		if (req.query.kind) {
			const { kind } = req.query;
			const administrationsCentral = await getIndicatorScores(
				kind as ProcedureKind
			);
			res.status(200).json(administrationsCentral);
		}
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
