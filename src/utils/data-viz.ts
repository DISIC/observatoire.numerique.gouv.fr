import { ProcedureKind } from '@/pages/api/indicator-scores';
import getPayloadClient from '@/payload/payload-client';
import { RecordData, validIndicatorSlugs } from './data-viz-client';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';
import { cacheKey, cachedCms, cachedData } from '@/utils/data-cache';

export async function getValidIndicators() {
	return cachedCms('valid-indicators', async () => {
		const payload = await getPayloadClient({ seed: false });
		return (
			await payload.find({
				collection: 'payload-indicators',
				where: {
					slug: {
						in: validIndicatorSlugs
					}
				}
			})
		).docs;
	});
}

type ValidIndicators = Awaited<ReturnType<typeof getValidIndicators>>;

// Colonnes utilisables dans le SQL brut
const PROCEDURE_KIND_COLUMNS: Record<ProcedureKind, Prisma.Sql> = {
	administration: Prisma.sql`p."administration"`,
	administration_central: Prisma.sql`p."administration_central"`,
	ministere: Prisma.sql`p."ministere"`
};

const onlineProcedureCondition = Prisma.sql`NOT EXISTS (
	SELECT 1 FROM "Field" o
	WHERE o."procedureId" = p.id AND o.slug = 'online' AND o.label = 'Non'
)`;

type FieldCountRow = {
	text: string;
	slug: string;
	goalReached: boolean;
	count: number;
};

async function getFieldCountsByKind(
	kind: ProcedureKind,
	editionId: string,
	kindValue?: string
) {
	const column = PROCEDURE_KIND_COLUMNS[kind];
	const kindCondition =
		kindValue === undefined
			? Prisma.sql`${column} IS NOT NULL`
			: Prisma.sql`${column} = ${kindValue}`;

	const rows = await prisma.$queryRaw<FieldCountRow[]>`
		SELECT ${column} AS "text", f.slug::text AS "slug", f."goalReached" AS "goalReached",
			count(*)::int AS "count"
		FROM "Field" f
		JOIN "Procedure" p ON p.id = f."procedureId"
		WHERE p."editionId" = ${editionId}
			AND ${kindCondition}
			AND ${onlineProcedureCondition}
			AND f.slug::text IN (${Prisma.join([...validIndicatorSlugs])})
			AND f."goalReached" IS NOT NULL
			AND f.label NOT IN (${Prisma.join(['À venir', '-'])})
			AND f.color::text <> 'gray'
		GROUP BY 1, 2, 3
	`;

	const countsByText = new Map<string, FieldCountRow[]>();
	for (const row of rows) {
		const bucket = countsByText.get(row.text) ?? [];
		bucket.push({ ...row, count: Number(row.count) });
		countsByText.set(row.text, bucket);
	}
	return countsByText;
}

function getIndicatorTemplates(validIndicators: ValidIndicators) {
	return validIndicators.map(indicator => {
		const indicatorLevels = indicator.levels?.docs?.filter(
			level => typeof level !== 'number'
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
}

function buildIndicatorScores(
	templates: RecordData['data'],
	counts: FieldCountRow[]
): RecordData['data'] {
	const indicators = templates.map(indicator => ({ ...indicator }));

	for (const slug of validIndicatorSlugs) {
		let countReached = 0;
		let countNotReached = 0;
		for (const row of counts) {
			if (row.slug !== slug) continue;
			if (row.goalReached) countReached += row.count;
			else countNotReached += row.count;
		}

		const totalCount = countReached + countNotReached;

		const score =
			totalCount > 0 ? Math.round((countReached / totalCount) * 100) : 0;

		indicators[
			indicators.findIndex(indicator => indicator.slug === slug)
		].score = score;
	}

	return indicators;
}

type GetIndicatorScoresByProcedureKindProps = {
	kind: ProcedureKind;
	editionId: string;
	groupByKind: { text: string; _count: number }[];
};

export async function getIndicatorScoresByProcedureKind({
	kind,
	editionId,
	groupByKind
}: GetIndicatorScoresByProcedureKindProps): Promise<RecordData[]> {
	const [validIndicators, countsByText] = await Promise.all([
		getValidIndicators(),
		getFieldCountsByKind(kind, editionId)
	]);
	const templates = getIndicatorTemplates(validIndicators);

	return groupByKind.map(group => ({
		text: group.text,
		count: group._count,
		data: buildIndicatorScores(templates, countsByText.get(group.text) ?? [])
	}));
}

type GetIndicatorScoresByProcedureKindSlugProps = {
	kind: ProcedureKind;
	slug: string;
	editionId: string | undefined;
};

export async function getIndicatorScoresByProcedureKindSlug({
	kind,
	slug,
	editionId
}: GetIndicatorScoresByProcedureKindSlugProps): Promise<RecordData> {
	if (!editionId) {
		const validIndicators = await getValidIndicators();
		return {
			text: slug,
			count: 0,
			data: buildIndicatorScores(getIndicatorTemplates(validIndicators), [])
		};
	}

	const column = PROCEDURE_KIND_COLUMNS[kind];
	const [validIndicators, countsByText, onlineCount] = await Promise.all([
		getValidIndicators(),
		getFieldCountsByKind(kind, editionId, slug),
		prisma.$queryRaw<{ count: number }[]>`
			SELECT count(*)::int AS "count" FROM "Procedure" p
			WHERE p."editionId" = ${editionId}
				AND ${column} = ${slug}
				AND ${onlineProcedureCondition}
		`
	]);

	return {
		text: slug,
		count: Number(onlineCount[0]?.count ?? 0),
		data: buildIndicatorScores(
			getIndicatorTemplates(validIndicators),
			countsByText.get(slug) ?? []
		)
	};
}

export async function getAllProceduresIndicatorScores(editionId: string) {
	return cachedData(
		cacheKey('all-procedures-indicator-scores', editionId),
		() => loadAllProceduresIndicatorScores(editionId)
	);
}

async function loadAllProceduresIndicatorScores(editionId: string) {
	const validIndicators = await getValidIndicators();

	const procedures = await prisma.procedure.findMany({
		where: {
			editionId: editionId,
			fields: {
				none: {
					slug: 'online',
					label: 'Non'
				}
			}
		},
		select: {
			id: true,
			title: true
		}
	});

	// Single aggregation across every procedure of the edition instead of one
	// groupBy per procedure (former N+1 that saturated the Mongo CPU).
	const groupedFields = await prisma.field.groupBy({
		by: ['procedureId', 'slug', 'goalReached', 'color'],
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
		_count: true
	});

	const fieldsByProcedure = new Map<string, typeof groupedFields>();
	for (const field of groupedFields) {
		const bucket = fieldsByProcedure.get(field.procedureId) ?? [];
		bucket.push(field);
		fieldsByProcedure.set(field.procedureId, bucket);
	}

	const results: {
		title: string;
		data: { slug: string; goalReached: boolean | null }[];
	}[] = procedures.map(procedure => {
		const fields = fieldsByProcedure.get(procedure.id) ?? [];

		const indicators = validIndicators.map(indicator => ({
			goalReached: null as boolean | null,
			slug: indicator.slug
		}));

		for (const slug of validIndicatorSlugs) {
			const fieldData = fields.filter(
				fieldData => fieldData.slug === slug && fieldData.color !== 'gray'
			);
			let countReached = 0;
			let countNotReached = 0;

			if (fieldData.length > 0) {
				const reachedData = fieldData.filter(f => f.goalReached);
				const notReachedData = fieldData.filter(f => !f.goalReached);

				countReached = reachedData
					? reachedData.reduce((sum, f) => sum + f._count, 0)
					: 0;
				countNotReached = notReachedData
					? notReachedData.reduce((sum, f) => sum + f._count, 0)
					: 0;

				const totalCount = countReached + countNotReached;

				const score =
					totalCount > 0 ? Math.round((countReached / totalCount) * 100) : 0;

				indicators[
					indicators.findIndex(indicator => indicator.slug === slug)
				].goalReached = score >= 80;
			}
		}

		return {
			title: procedure.title,
			data: indicators
		};
	});

	return results;
}

export type IndicatorThresholdScore = {
	slug: (typeof validIndicatorSlugs)[number];
	reached: number;
	total: number;
	percentage: number;
};

export async function getIndicatorThresholdScores(
	editionId: string,
	slugs: (typeof validIndicatorSlugs)[number][]
): Promise<IndicatorThresholdScore[]> {
	const allProceduresRecords = await getAllProceduresIndicatorScores(editionId);

	return slugs.map(slug => {
		const total = allProceduresRecords.filter(item =>
			item.data.find(data => data.slug === slug && data.goalReached !== null)
		).length;
		const reached = allProceduresRecords.filter(item =>
			item.data.find(data => data.slug === slug && data.goalReached)
		).length;
		return {
			slug,
			reached,
			total,
			percentage: total > 0 ? Math.round((reached / total) * 100) : 0
		};
	});
}
