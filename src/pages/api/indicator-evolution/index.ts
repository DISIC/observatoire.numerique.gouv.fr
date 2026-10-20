import { PayloadIndicator } from '@/payload/payload-types';
import {
	isValidIndicatorSlug,
	validIndicatorSlugs
} from '@/utils/data-viz-client';
import { getValidIndicators } from '@/utils/data-viz';
import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import {
	setNoStoreHeaders,
	setPublicCacheHeaders
} from '@/utils/cache-headers';
import { ProcedureKind } from '../indicator-scores';
import { prisma } from '@/utils/prisma';
import { isProcedureKind } from '@/utils/tools';
import { cacheKey, cachedData } from '@/utils/data-cache';

// Exclut les démarches hors ligne, comme le calcul des scores (utils/data-viz.ts)
const onlineProcedureFilter: Prisma.ProcedureWhereInput = {
	fields: {
		none: {
			slug: 'online',
			label: 'Non'
		}
	}
};

export type EvolutionViewType = 'year' | 'edition';

const EVOLUTION_VIEWS: readonly EvolutionViewType[] = ['year', 'edition'];

const EVOLUTION_COLUMN_KEYS = [
	'administration',
	'administration_central',
	'ministere',
	'title_normalized'
] as const;

type EvolutionColumnKey = (typeof EVOLUTION_COLUMN_KEYS)[number];

const isEvolutionColumnKey = (value: unknown): value is EvolutionColumnKey =>
	typeof value === 'string' &&
	(EVOLUTION_COLUMN_KEYS as readonly string[]).includes(value);

export type GetIndicatorEvolutionProps = {
	view: EvolutionViewType;
	slug: (typeof validIndicatorSlugs)[number];
	columnKey: ProcedureKind | 'title_normalized';
	columnValue?: string;
	singleValue?: boolean;
	kind?: ProcedureKind;
	kindValue?: string;
};

export type DataLevel = {
	label: string;
	color?: string;
	position?: number;
	description?: string;
};

export type RecordDataGrouped = {
	name: string;
	values: (DataLevel & {
		value: number;
		valueLabel?: string;
		cross?: number;
		crossValueLabel?: string;
	})[];
};

export type IndicatorEvolutionResponse = {
	indicator: PayloadIndicator;
	groupedData: RecordDataGrouped[];
};

export async function getEditionsByCreationDesc() {
	return cachedData('editions-by-creation-desc', () =>
		prisma.edition.findMany({
			orderBy: {
				created_at: 'desc'
			}
		})
	);
}

export async function getOnlineProceduresWithIndicatorField(
	slug: (typeof validIndicatorSlugs)[number]
) {
	return cachedData(cacheKey('evolution-procedures', slug), () =>
		loadOnlineProceduresWithIndicatorField(slug)
	);
}

function loadOnlineProceduresWithIndicatorField(
	slug: (typeof validIndicatorSlugs)[number]
) {
	return prisma.procedure.findMany({
		where: onlineProcedureFilter,
		select: {
			id: true,
			editionId: true,
			administration: true,
			administration_central: true,
			ministere: true,
			title_normalized: true,
			fields: { where: { slug }, orderBy: { id: 'asc' } }
		},
		orderBy: { id: 'asc' }
	});
}

type ProcedureWithIndicatorField = Awaited<
	ReturnType<typeof loadOnlineProceduresWithIndicatorField>
>[number];

export async function getIndicatorEvolution({
	view,
	slug,
	columnKey,
	columnValue,
	singleValue = false,
	kind,
	kindValue
}: GetIndicatorEvolutionProps): Promise<IndicatorEvolutionResponse | null> {
	if (view !== 'year' && view !== 'edition') return null;

	const [validIndicators, allEditions, allProcedures] = await Promise.all([
		getValidIndicators(),
		getEditionsByCreationDesc(),
		getOnlineProceduresWithIndicatorField(slug)
	]);

	const validIndicator = validIndicators.find(
		indicator => indicator.slug === slug
	);

	if (!validIndicator) {
		return null;
	}

	const indicatorLevels = validIndicator.levels?.docs || [];

	const getCrossValueLabel = (
		crossValue: number | undefined
	): string | undefined => {
		if (crossValue === undefined) return undefined;

		const sortedLevels = indicatorLevels
			.filter(
				level =>
					typeof level !== 'number' &&
					level.label_stats &&
					level.threshold !== undefined &&
					level.threshold !== null
			)
			.sort((a, b) => {
				if (typeof a === 'number' || typeof b === 'number') return 0;
				return (b.threshold ?? 0) - (a.threshold ?? 0);
			});

		for (const level of sortedLevels) {
			if (typeof level === 'number' || !level.label_stats) continue;

			if (validIndicator.slug === 'dlnuf') {
				if (crossValue >= (level.threshold ?? 0)) {
					return level.label_stats;
				}
			} else {
				if (crossValue >= (level.threshold ?? 0)) {
					return (
						level.label?.replace(/X/g, crossValue.toString()) || level.label
					);
				}
			}
		}

		const lastLevel = sortedLevels[sortedLevels.length - 1];

		return typeof lastLevel !== 'number' && lastLevel?.label_stats
			? lastLevel.label_stats
			: undefined;
	};

	// Copie : la liste peut venir du cache, pas de tri en place
	const editions = allEditions.slice(
		0,
		view === 'edition' && !singleValue ? 5 : undefined
	);

	editions.sort((a, b) => {
		return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
	});

	const matchesColumn = (procedure: ProcedureWithIndicatorField) =>
		columnValue === undefined || procedure[columnKey] === columnValue;
	const matchesKind = (procedure: ProcedureWithIndicatorField) =>
		kind === undefined ||
		kindValue === undefined ||
		procedure[kind] === kindValue;

	const selectProcedures = (editionIds: string[]) => {
		const ids = new Set(editionIds);
		const inEditions = allProcedures.filter(
			procedure => procedure.editionId !== null && ids.has(procedure.editionId)
		);
		return {
			procedures: inEditions.filter(matchesColumn),
			procedureKindElements: inEditions.filter(matchesKind)
		};
	};

	const getCross = (procedureKindElements: ProcedureWithIndicatorField[]) =>
		procedureKindElements.length > 0
			? (() => {
					const values = procedureKindElements
						.map(p => {
							const field = p.fields.find(f => f.slug === validIndicator.slug);
							const value =
								field && field.value ? parseFloat(field.value) : NaN;
							return isNaN(value) ? null : value;
						})
						.filter((v): v is number => v !== null);
					if (values.length === 0) return undefined;
					return (
						Math.round(
							(values.reduce((acc, v) => acc + v, 0) / values.length) * 10
						) / 10
					);
			  })()
			: undefined;

	const getGroupedLevels = (procedures: ProcedureWithIndicatorField[]) => {
		const fields = procedures.flatMap(p => p.fields);

		const levelCounts = indicatorLevels
			.map(level => {
				if (typeof level === 'number' || !level.label_stats) return null;
				const count = new Set(
					fields
						.filter(
							field =>
								field.slug === slug &&
								(field.color === 'gray' || field.slug === 'auth'
									? field.label === level.label_stats
									: field.color === level.color)
						)
						.map(field => field.procedureId)
				).size;

				return {
					label: level.label_stats,
					color: level.color,
					position: level.position,
					description: level.description,
					value: count
				};
			})
			.filter(item => item !== null);

		return levelCounts.reduce((acc, current) => {
			const existing = acc.find(
				item => item.label === current.label && item.color === current.color
			);
			if (existing) {
				existing.value += current.value;
			} else {
				acc.push({ ...current });
			}
			return acc;
		}, [] as RecordDataGrouped['values'][number][]);
	};

	const singleValueLabel =
		(slug === 'satisfaction' || slug === 'simplicity' ? 'Moyenne ' : '') +
		validIndicator.label;

	if (view === 'year') {
		const yearEditionIds: Record<string, string[]> = {};
		editions.forEach(edition => {
			const year = edition.name.match(/\d{4}/)?.[0];
			if (year) {
				if (!yearEditionIds[year]) {
					yearEditionIds[year] = [];
				}
				yearEditionIds[year].push(edition.id);
			}
		});

		const data = Object.entries(yearEditionIds).map(([year, editionIds]) => {
			const { procedures, procedureKindElements } =
				selectProcedures(editionIds);

			if (singleValue) {
				if (!procedures[0]) return;

				const cross = getCross(procedureKindElements);
				const crossValueLabel = getCrossValueLabel(cross);

				const totalValue = procedures.reduce((sum, procedure) => {
					const field = procedure.fields.find(
						f => f.slug === validIndicator.slug
					);
					return sum + (field ? parseFloat(field.value || '0') : 0);
				}, 0);
				const averageValue =
					procedures.length > 0
						? Math.round((totalValue / procedures.length) * 10) / 10
						: 0;
				const newLabelValue = procedures[0]?.fields
					.find(f => f.slug === validIndicator.slug)
					?.label.includes('/ 10')
					? `${averageValue} / 10`
					: procedures[0]?.fields.find(f => f.slug === validIndicator.slug)
							?.label;

				return {
					year: year,
					levels: [
						{
							label: singleValueLabel,
							value: averageValue,
							valueLabel: newLabelValue,
							cross: cross,
							crossValueLabel: crossValueLabel
						}
					]
				};
			}

			return {
				year: year,
				levels: getGroupedLevels(procedures)
			};
		});

		const result: RecordDataGrouped[] = data
			.filter(e => !!e)
			.map(editionData => ({
				name: editionData.year,
				values: editionData.levels
			}));

		return {
			indicator: validIndicator,
			groupedData: result
		};
	}

	const data = editions.map(edition => {
		const { procedures, procedureKindElements } = selectProcedures([
			edition.id
		]);

		if (singleValue) {
			if (!procedures[0]) return;

			const cross = getCross(procedureKindElements);
			const crossValueLabel = getCrossValueLabel(cross);
			const field = procedures[0].fields.find(
				f => f.slug === validIndicator.slug
			);

			return {
				edition: edition.name,
				levels: [
					{
						label: singleValueLabel,
						value: parseFloat(field?.value || '0'),
						valueLabel: field?.label,
						cross: cross,
						crossValueLabel: crossValueLabel
					}
				]
			};
		}

		return {
			edition: edition.name,
			levels: getGroupedLevels(procedures)
		};
	});

	const result: RecordDataGrouped[] = data
		.filter(e => !!e)
		.map(editionData => {
			const [firstPart, ...rest] = (editionData.edition || '').split(' ');
			const formattedName = firstPart
				? `${firstPart.charAt(0).toUpperCase()}${firstPart
						.slice(1)
						.toLowerCase()} ${rest.join(' ')}`
				: editionData.edition;
			return {
				name: formattedName,
				values: editionData.levels
			};
		});

	return { indicator: validIndicator, groupedData: result };
}

const optionalString = (value: unknown): value is string | undefined =>
	value === undefined || typeof value === 'string';

export function parseIndicatorEvolutionQuery(
	query: NextApiRequest['query']
): GetIndicatorEvolutionProps | null {
	const { view, slug, columnKey, columnValue, singleValue, kind, kindValue } =
		query;

	if (
		typeof view !== 'string' ||
		!(EVOLUTION_VIEWS as readonly string[]).includes(view) ||
		typeof slug !== 'string' ||
		!isValidIndicatorSlug(slug) ||
		!isEvolutionColumnKey(columnKey) ||
		!optionalString(columnValue) ||
		!optionalString(singleValue) ||
		!optionalString(kindValue) ||
		(kind !== undefined && !isProcedureKind(kind))
	) {
		return null;
	}

	return {
		view: view as EvolutionViewType,
		slug,
		columnKey,
		columnValue,
		singleValue: singleValue === 'true',
		kind,
		kindValue
	};
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	setNoStoreHeaders(res);
	if (req.method !== 'GET') {
		return res.status(400).json({ message: 'Unsupported method' });
	}

	const params = parseIndicatorEvolutionQuery(req.query);
	if (!params) {
		return res.status(400).json({
			message: `Invalid parameters. view: year|edition, slug: ${validIndicatorSlugs.join(
				'|'
			)}, columnKey: ${EVOLUTION_COLUMN_KEYS.join('|')}`
		});
	}

	try {
		const indicatorEvolutionData = await cachedData(
			cacheKey('indicator-evolution', params),
			() => getIndicatorEvolution(params)
		);

		if (!indicatorEvolutionData) {
			setPublicCacheHeaders(res);
			return res.status(404).json({
				message: 'No data found for the given parameters.'
			});
		}
		setPublicCacheHeaders(res);
		return res.status(200).json(indicatorEvolutionData);
	} catch (err) {
		console.error('GET /api/indicator-evolution failed:', err);
		return res.status(500).json({ message: 'Internal error' });
	}
}
