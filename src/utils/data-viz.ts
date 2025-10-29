import { ProcedureKind } from '@/pages/api/indicator-scores';
import getPayloadClient from '@/payload/payload-client';
import {
	PayloadIndicator,
	PayloadIndicatorLevel
} from '@/payload/payload-types';
import { PrismaClient } from '@prisma/client';
import { RecordData, validIndicatorSlugs } from './data-viz-client';
import { desufligyText } from './tools';

const prisma = new PrismaClient();

async function getIndicatorScores(props: {
	kind: ProcedureKind;
	group: GetIndicatorScoresByProcedureKindProps['groupByKind'][number];
}) {
	const { group, kind } = props;
	const payload = await getPayloadClient({ seed: false });

	const validIndicators = (
		await payload.find({
			collection: 'payload-indicators',
			where: {
				slug: {
					in: validIndicatorSlugs
				}
			}
		})
	).docs;

	const procedures = await prisma.procedure.findMany({
		where: {
			[kind]: group.text
		},
		select: {
			id: true
		}
	});

	const fields = await prisma.field.groupBy({
		by: ['slug', 'goalReached'],
		where: {
			slug: {
				in: [...validIndicatorSlugs]
			},
			procedureId: {
				in: procedures.map(procedure => procedure.id)
			},
			goalReached: {
				not: null
			}
		},
		orderBy: {
			slug: 'asc'
		},
		_count: true
	});

	const indicators = validIndicators.map(indicator => {
		const indicatorLevels = indicator.levels?.docs?.filter(
			level => typeof level !== 'string'
		);
		const goalReachedIndicatorLevels =
			indicatorLevels?.filter(level => level.goal_reached) || [];
		let goalLabel = '';

		switch (indicator.slug) {
			case 'satisfaction':
			case 'simplicity':
				goalLabel = goalReachedIndicatorLevels[0]?.threshold
					? goalReachedIndicatorLevels[0].label
							.replace(/\s*/g, '')
							.replace(
								/X{1,5}/g,
								goalReachedIndicatorLevels[0].threshold.toString()
							)
					: '';
				break;
			case 'auth':
				goalLabel = goalReachedIndicatorLevels
					.map(level => level.label)
					.join(' ou ');
				break;
			case 'handicap':
			case 'dlnuf':
				goalLabel = `"${goalReachedIndicatorLevels[0].description}"`;
				break;
		}

		return {
			score: 0,
			goal: 80,
			cross: 0,
			slug: indicator.slug,
			name: indicator.label,
			description_radar: indicator.description_radar,
			description_header: indicator.description_header,
			icon: indicator.icon,
			goalLabel
		};
	}) as RecordData['data'];

	for (const field of validIndicatorSlugs) {
		const fieldData = fields.filter(fieldData => fieldData.slug === field);

		let countReached = 0;
		let countNotReached = 0;

		if (fieldData.length > 0) {
			const reachedData = fieldData.find(f => f.goalReached === true);
			const notReachedData = fieldData.find(f => f.goalReached === false);

			countReached = reachedData ? reachedData._count : 0;
			countNotReached = notReachedData ? notReachedData._count : 0;
		}

		const totalCount = countReached + countNotReached;
		const score =
			totalCount > 0 ? Math.round((countReached / totalCount) * 100) : 0;

		indicators[
			indicators.findIndex(indicator => indicator.slug === field)
		].score = score;
	}

	return {
		text: group.text,
		count: group._count ? group._count : procedures.length,
		data: indicators
	};
}

type GetIndicatorScoresByProcedureKindProps = {
	kind: ProcedureKind;
	groupByKind: { text: string; _count: number }[];
};

export async function getIndicatorScoresByProcedureKind({
	kind,
	groupByKind
}: GetIndicatorScoresByProcedureKindProps) {
	const records = await Promise.all(
		groupByKind.map(
			async group =>
				await getIndicatorScores({
					kind,
					group
				})
		)
	);

	return records;
}

type GetIndicatorScoresByProcedureKindSlugProps = {
	kind: ProcedureKind;
	slug: string;
};

export async function getIndicatorScoresByProcedureKindSlug({
	kind,
	slug
}: GetIndicatorScoresByProcedureKindSlugProps) {
	const data = await getIndicatorScores({
		kind,
		group: { text: desufligyText(slug), _count: 0 }
	});

	return data;
}

export async function getAllProceduresIndicatorScores(editionId: string) {
	const payload = await getPayloadClient({ seed: false });

	const validIndicators = (
		await payload.find({
			collection: 'payload-indicators',
			where: {
				slug: {
					in: validIndicatorSlugs
				}
			}
		})
	).docs;

	const procedures = await prisma.procedure.findMany({
		where: {
			editionId: editionId
		}
	});

	const results: {
		title: string;
		data: { slug: string; goalReached: boolean }[];
	}[] = await Promise.all(
		procedures.map(async procedure => {
			const fields = await prisma.field.groupBy({
				by: ['slug', 'goalReached'],
				where: {
					slug: {
						in: [...validIndicatorSlugs]
					},
					procedureId: procedure.id,
					goalReached: {
						not: null
					}
				},
				orderBy: {
					slug: 'asc'
				},
				_count: true
			});

			const indicators = validIndicators.map(indicator => ({
				goalReached: false,
				slug: indicator.slug
			}));

			for (const slug of validIndicatorSlugs) {
				const fieldData = fields.filter(fieldData => fieldData.slug === slug);
				let countReached = 0;
				let countNotReached = 0;

				if (fieldData.length > 0) {
					const reachedData = fieldData.find(f => f.goalReached);
					const notReachedData = fieldData.find(f => !f.goalReached);

					countReached = reachedData ? reachedData._count : 0;
					countNotReached = notReachedData ? notReachedData._count : 0;
				}

				const totalCount = countReached + countNotReached;

				const score =
					totalCount > 0 ? Math.round((countReached / totalCount) * 100) : 0;

				indicators[
					indicators.findIndex(indicator => indicator.slug === slug)
				].goalReached = score >= 80;
			}
			return {
				title: procedure.title,
				data: indicators
			};
		})
	);

	return results;
}
