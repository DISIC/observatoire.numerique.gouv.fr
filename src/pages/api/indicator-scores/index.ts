import {
	getAllProceduresIndicatorScores,
	getIndicatorScoresByProcedureKind,
	getIndicatorScoresByProcedureKindSlug
} from '@/utils/data-viz';
import { validIndicatorSlugs } from '@/utils/data-viz-client';
import { isProcedureKind } from '@/utils/tools';
import { NextApiRequest, NextApiResponse } from 'next';
import {
	setNoStoreHeaders,
	setPublicCacheHeaders
} from '@/utils/cache-headers';
import { prisma } from '@/utils/prisma';
import { getLastEdition } from '@/utils/editions-server';
import { cacheKey, cachedData } from '@/utils/data-cache';

export type ProcedureKind =
	| 'administration'
	| 'administration_central'
	| 'ministere';

export async function getIndicatorScores(kind: ProcedureKind) {
	return cachedData(cacheKey('indicator-scores', { kind }), () =>
		loadIndicatorScores(kind)
	);
}

async function loadIndicatorScores(kind: ProcedureKind) {
	const currentEdition = await getLastEdition();
	if (!currentEdition) throw new Error('No edition found');

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

	const [scoresByKind, allProceduresRecords] = await Promise.all([
		getIndicatorScoresByProcedureKind({
			kind,
			editionId: currentEdition.id,
			groupByKind
		}),
		getAllProceduresIndicatorScores(currentEdition.id)
	]);
	let records = scoresByKind;

	const dataCrossKind: { slug: string; value: number }[] =
		validIndicatorSlugs.map(slug => {
			const total = allProceduresRecords.filter(item =>
				item.data.find(data => data.slug === slug && data.goalReached !== null)
			).length;
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
	setNoStoreHeaders(res);
	if (req.method !== 'GET') {
		return res.status(400).json({ message: 'Unsupported method' });
	}

	const { kind, slug } = req.query;
	if (!isProcedureKind(kind)) {
		return res.status(400).json({ message: 'Invalid kind' });
	}

	try {
		if (typeof slug === 'string') {
			const indicatorScore = await cachedData(
				cacheKey('indicator-scores-slug', { kind, slug }),
				async () =>
					getIndicatorScoresByProcedureKindSlug({
						kind,
						slug,
						editionId: (await getLastEdition())?.id
					})
			);
			setPublicCacheHeaders(res);
			return res.status(200).json(indicatorScore);
		}
		const indicatorScores = await getIndicatorScores(kind);
		setPublicCacheHeaders(res);
		return res.status(200).json(indicatorScores);
	} catch (err) {
		console.error('GET /api/indicator-scores failed:', err);
		return res.status(500).json({ message: 'Internal error' });
	}
}
