import getPayloadClient from '@/payload/payload-client';
import { PayloadIndicator } from '@/payload/payload-types';
import {
	isValidIndicatorSlug,
	isValidProcedureColumnKey,
	isValidProcedureKind,
	validIndicatorSlugs
} from '@/utils/data-viz-client';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { ProcedureKind } from '../indicator-scores';

export type EvolutionViewType = 'year' | 'edition';

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

	const prisma = new PrismaClient();
	const payload = await getPayloadClient({ seed: false });

	const validIndicator = (
		await payload.find({
			collection: 'payload-indicators',
			where: {
				slug: {
					equals: slug
				}
			}
		})
	).docs[0];

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
					typeof level !== 'string' &&
					level.label_stats &&
					level.threshold !== undefined &&
					level.threshold !== null
			)
			.sort((a, b) => {
				if (typeof a === 'string' || typeof b === 'string') return 0;
				return (b.threshold ?? 0) - (a.threshold ?? 0);
			});

		for (const level of sortedLevels) {
			if (typeof level === 'string' || !level.label_stats) continue;

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

		return typeof lastLevel !== 'string' && lastLevel?.label_stats
			? lastLevel.label_stats
			: undefined;
	};

	const editions = await prisma.edition.findMany({
		orderBy: {
			created_at: 'desc'
		},
		take: view === 'edition' && !singleValue ? 5 : undefined
	});

	editions.sort((a, b) => {
		return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
	});

	let cross: number | undefined;
	let crossValueLabel: string | undefined;

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

		const data = await Promise.all(
			Object.entries(yearEditionIds).map(async ([year, editionIds]) => {
				const procedures = await prisma.procedure.findMany({
					where: {
						editionId: {
							in: editionIds
						},
						[columnKey]: columnValue
					},
					include: {
						fields: true
					}
				});

				const procedureKindElements = await prisma.procedure.findMany({
					where: {
						editionId: {
							in: editionIds
						},
						...(kind !== undefined && kindValue !== undefined
							? { [kind]: kindValue }
							: {})
					},
					include: {
						fields: true
					}
				});

				cross =
					procedureKindElements.length > 0
						? (() => {
								const values = procedureKindElements
									.map(p => {
										const field = p.fields.find(
											f => f.slug === validIndicator.slug
										);
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

				crossValueLabel = getCrossValueLabel(cross);

				if (singleValue) {
					if (!procedures[0] || procedures[0].fields.length === 0) return;

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
								label:
									(slug === 'satisfaction' || slug === 'simplicity'
										? 'Moyenne '
										: '') + validIndicator.label,
								value: averageValue,
								valueLabel: newLabelValue,
								cross: cross,
								crossValueLabel: crossValueLabel
							}
						]
					};
				}

				const fields = procedures.flatMap(p => p.fields);

				const levelCounts = indicatorLevels
					.map(level => {
						if (typeof level === 'string' || !level.label_stats) return null;

						const count = new Set(
							fields
								.filter(
									field =>
										field.slug === slug &&
										(field.color === 'gray'
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

				const groupedBySameLabel = levelCounts.reduce((acc, current) => {
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

				return {
					year: year,
					levels: groupedBySameLabel
				};
			})
		);

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

	const data = await Promise.all(
		editions.map(async edition => {
			const procedures = await prisma.procedure.findMany({
				where: {
					editionId: edition.id,
					[columnKey]: columnValue
				},
				include: {
					fields: true
				}
			});

			const procedureKindElements = await prisma.procedure.findMany({
				where: {
					editionId: edition.id,
					...(kind !== undefined && kindValue !== undefined
						? { [kind]: kindValue }
						: {})
				},
				include: {
					fields: true
				}
			});

			cross =
				procedureKindElements.length > 0
					? (() => {
							const values = procedureKindElements
								.map(p => {
									const field = p.fields.find(
										f => f.slug === validIndicator.slug
									);
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
			crossValueLabel = getCrossValueLabel(cross);

			if (singleValue) {
				if (!procedures[0] || procedures[0].fields.length === 0) return;
				return {
					edition: edition.name,
					levels: [
						{
							label:
								(slug === 'satisfaction' || slug === 'simplicity'
									? 'Moyenne '
									: '') + validIndicator.label,
							value: parseFloat(
								procedures[0].fields.find(f => f.slug === validIndicator.slug)
									?.value || '0'
							),
							valueLabel: procedures[0].fields.find(
								f => f.slug === validIndicator.slug
							)?.label,
							cross: cross,
							crossValueLabel: crossValueLabel
						}
					]
				};
			}

			const fields = procedures.flatMap(p => p.fields);

			const levelCounts = indicatorLevels
				.map(level => {
					if (typeof level === 'string' || !level.label_stats) return null;

					const count = new Set(
						fields
							.filter(
								field =>
									field.slug === slug &&
									(field.color === 'gray'
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

			const groupedBySameLabel = levelCounts.reduce((acc, current) => {
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

			return {
				edition: edition.name,
				levels: groupedBySameLabel
			};
		})
	);

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

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		if (
			!req.query.view ||
			!req.query.slug ||
			!req.query.columnKey ||
			!req.query.columnValue
		) {
			return res.status(400).json({
				message: 'Missing view or slug query parameter.'
			});
		}

		const { view, slug, columnKey, columnValue, singleValue, kind, kindValue } =
			req.query;

		if (columnKey && !isValidProcedureColumnKey(columnKey as string)) {
			return res.status(400).json({
				message: `Invalid columnKey parameter.`
			});
		}
		if (kind !== undefined && !isValidProcedureKind(kind as string)) {
			return res.status(400).json({
				message: `Invalid kind parameter.`
			});
		}
		if (slug && !isValidIndicatorSlug(slug as string)) {
			return res.status(400).json({
				message: `Invalid slug parameter. Must be one of: ${validIndicatorSlugs.join(
					', '
				)}`
			});
		}

		const indicatorEvolutionData = await getIndicatorEvolution({
			view: view as EvolutionViewType,
			slug: slug as (typeof validIndicatorSlugs)[number],
			columnKey: columnKey as ProcedureKind | 'title_normalized',
			columnValue: columnValue as string,
			singleValue: singleValue === 'true',
			kind: kind as ProcedureKind | undefined,
			kindValue: kindValue as string | undefined
		});

		if (!indicatorEvolutionData) {
			return res.status(404).json({
				message: 'No data found for the given parameters.'
			});
		}
		res.status(200).json(indicatorEvolutionData);
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
