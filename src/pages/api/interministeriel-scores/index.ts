import {
	getIndicatorThresholdScores,
	IndicatorThresholdScore
} from '@/utils/data-viz';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const interministerielSlugs = ['satisfaction', 'handicap'] as const;

export type InterministerielScore = IndicatorThresholdScore & {
	previousPercentage: number | null;
	delta: number | null;
};

export type InterministerielScoresResponse = InterministerielScore[];

export async function getInterministerielScores(): Promise<InterministerielScoresResponse> {
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
	if (req.method === 'GET') {
		const scores = await getInterministerielScores();
		res.status(200).json(scores);
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
