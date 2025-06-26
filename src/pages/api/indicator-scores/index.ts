import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import {
	getIndicatorScoresByProcedureKind,
	getIndicatorScoresByProcedureKindSlug,
	RecordData
} from '@/utils/data-viz';

export type ProcedureKind =
	| 'administration'
	| 'administration_central'
	| 'ministere';

const prisma = new PrismaClient();

export async function getIndicatorScores(kind: ProcedureKind) {
	const currentEdition = await prisma.edition.findFirstOrThrow({
		orderBy: {
			created_at: 'desc'
		}
	});

	const elementGroupedByProcedureKind = await prisma.procedure.groupBy({
		by: [kind],
		where: {
			editionId: currentEdition.id
		},
		_count: true
	});

	const groupByKind = elementGroupedByProcedureKind
		.filter(element => element[kind])
		.map(element => ({
			text: element[kind] as string,
			_count: element._count
		}));

	let records = await getIndicatorScoresByProcedureKind({
		kind,
		groupByKind
	});

	const dataCrossKind = records
		.reduce((acc, current) => {
			current.data.forEach((item, i) => {
				if (!acc[i]) acc[i] = { ...item, score: 0 };
				acc[i].score += item.score;
			});
			return acc;
		}, [] as RecordData['data'])
		.map(item => Math.round(item.score / records.length));

	records = records.map(item => ({
		...item,
		data: item.data.map((data, subIndex) => ({
			...data,
			cross: dataCrossKind[subIndex]
		}))
	}));

	records = records.sort((a, b) => a.text.localeCompare(b.text));

	return records;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		if (req.query.kind) {
			const { kind, slug } = req.query;
			if (!slug || typeof slug !== 'string') {
				const indicatorScores = await getIndicatorScores(kind as ProcedureKind);
				res.status(200).json(indicatorScores);
			} else {
				let indicatorScore = await getIndicatorScoresByProcedureKindSlug({
					kind: kind as ProcedureKind,
					slug: slug as string
				});

				res.status(200).json(indicatorScore);
			}
		}
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
