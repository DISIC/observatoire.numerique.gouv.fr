import {
	getAllProceduresIndicatorScores,
	getIndicatorScoresByProcedureKind,
	getIndicatorScoresByProcedureKindSlug
} from '@/utils/data-viz';
import { validIndicatorSlugs } from '@/utils/data-viz-client';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export type ProcedureKind =
	| 'administration'
	| 'administration_central'
	| 'ministere';

const prisma = new PrismaClient();

export async function getIndicatorScores(kind: ProcedureKind, search?: string) {
	const currentEdition = await prisma.edition.findFirstOrThrow({
		orderBy: {
			created_at: 'desc'
		}
	});

	const elementGroupedByProcedureKind = await prisma.procedure.groupBy({
		by: [kind],
		where: {
			editionId: currentEdition.id,
			[kind]: {
				contains: search,
				mode: 'insensitive'
			}
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

	const allProceduresRecords = await getAllProceduresIndicatorScores(
		currentEdition.id
	);

	const dataCrossKind: { slug: string; value: number }[] =
		validIndicatorSlugs.map(slug => {
			const total = allProceduresRecords.length;
			const reached = allProceduresRecords.filter(item =>
				item.data.find(data => data.slug === slug && data.goalReached)
			).length;
			return {
				slug,
				value: total > 0 ? Math.round((reached / total) * 100) : 0
			};
		});

	records = records.map(item => ({
		...item,
		data: item.data.map(data => ({
			...data,
			cross: dataCrossKind.find(d => d.slug === data.slug)?.value || 0
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
				const indicatorScores = await getIndicatorScores(
					kind as ProcedureKind,
					req.query.search as string | undefined
				);
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
