import {
	getIndicatorThresholdScores,
	IndicatorThresholdScore
} from '@/utils/data-viz';
import { NextApiRequest, NextApiResponse } from 'next';
import {
	setNoStoreHeaders,
	setPublicCacheHeaders
} from '@/utils/cache-headers';
import { prisma } from '@/utils/prisma';
import { cachedData } from '@/utils/data-cache';

const interministerielSlugs = ['satisfaction', 'handicap'] as const;

export type InterministerielScore = IndicatorThresholdScore & {
	previousPercentage: number | null;
	delta: number | null;
};

export type InterministerielScoresResponse = InterministerielScore[];

export async function getInterministerielScores(): Promise<InterministerielScoresResponse> {
	return cachedData('interministeriel-scores', loadInterministerielScores);
}

async function loadInterministerielScores(): Promise<InterministerielScoresResponse> {
	const editions = await prisma.edition.findMany({
		orderBy: {
			created_at: 'desc'
		},
		take: 2
	});

	const currentEdition = editions[0];
	const previousEdition = editions[1];

	if (!currentEdition) return [];

	const slugs = [...interministerielSlugs];

	const currentScores = await getIndicatorThresholdScores(
		currentEdition.id,
		slugs
	);
	const previousScores = previousEdition
		? await getIndicatorThresholdScores(previousEdition.id, slugs)
		: [];

	return currentScores.map(score => {
		const previous = previousScores.find(p => p.slug === score.slug);
		const previousPercentage =
			previous && previous.total > 0 ? previous.percentage : null;
		return {
			...score,
			previousPercentage,
			delta:
				previousPercentage !== null
					? score.percentage - previousPercentage
					: null
		};
	});
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	setNoStoreHeaders(res);
	if (req.method !== 'GET') {
		return res.status(400).json({ message: 'Unsupported method' });
	}

	try {
		const scores = await getInterministerielScores();
		setPublicCacheHeaders(res);
		return res.status(200).json(scores);
	} catch (err) {
		console.error('GET /api/interministeriel-scores failed:', err);
		return res.status(500).json({ message: 'Internal error' });
	}
}
