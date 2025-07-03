import getPayloadClient from '@/payload/payload-client';
import {
	isValidIndicatorSlug,
	isValidProcedureColumnKey,
	validIndicatorSlugs
} from '@/utils/data-viz-client';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { ProcedureKind } from '../indicator-scores';
import { PayloadIndicator } from '@/payload/payload-types';

export type EvolutionViewType = 'year' | 'edition';

export type GetIndicatorEvolutionProps = {
	view: EvolutionViewType;
	slug: (typeof validIndicatorSlugs)[number];
	columnKey: ProcedureKind | 'title_normalized';
	columnValue?: string;
	singleValue?: boolean;
};

export type DataLevel = {
	label: string;
	color?: string;
	position?: number;
	description?: string;
};

export type RecordDataGrouped = {
	name: string;
	values: (DataLevel & { value: number; valueLabel?: string })[];
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
	singleValue = false
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

	const editions = await prisma.edition.findMany({
		orderBy: {
			created_at: 'desc'
		},
		take: view === 'edition' && !singleValue ? 5 : undefined
	});

	editions.sort((a, b) => {
		return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
	});

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

				if (singleValue && procedures[0] && procedures[0].fields.length > 0) {
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
								label: `Moyenne ${validIndicator.label}`,
								value: averageValue,
								valueLabel: newLabelValue
							}
						]
					};
				}

				const fields = procedures.flatMap(p => p.fields);

				const levelCounts = indicatorLevels
					.map(level => {
						if (typeof level === 'string' || !level.label_stats) return null;

						const count = fields.filter(field =>
							field.color === 'gray'
								? field.label === level.label_stats
								: field.color === level.color
						).length;

						return {
							label: level.label_stats,
							color: level.color,
							position: level.position,
							description: level.description,
							value: count
						};
					})
					.filter(item => item !== null);

				return {
					year: year,
					levels: levelCounts
				};
			})
		);

		const result: RecordDataGrouped[] = data
			.filter(editionData => editionData.levels.some(level => level.value > 0))
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

			if (singleValue && procedures[0] && procedures[0].fields.length > 0) {
				return {
					edition: edition.name,
					levels: [
						{
							label: `Moyenne ${validIndicator.label}`,
							value: parseFloat(
								procedures[0].fields.find(f => f.slug === validIndicator.slug)
									?.value || '0'
							),
							valueLabel: procedures[0].fields.find(
								f => f.slug === validIndicator.slug
							)?.label
						}
					]
				};
			}

			const fields = procedures.flatMap(p => p.fields);

			const levelCounts = indicatorLevels
				.map(level => {
					if (typeof level === 'string' || !level.label_stats) return null;

					const count = fields.filter(field =>
						field.color === 'gray'
							? field.label === level.label_stats
							: field.color === level.color
					).length;

					return {
						label: level.label_stats,
						color: level.color,
						position: level.position,
						description: level.description,
						value: count
					};
				})
				.filter(item => item !== null);

			return {
				edition: edition.name,
				levels: levelCounts
			};
		})
	);

	const result: RecordDataGrouped[] = data
		.filter(editionData => editionData.levels.some(level => level.value > 0))
		.map(editionData => ({
			name: editionData.edition,
			values: editionData.levels
		}));

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

		const { view, slug, columnKey, columnValue, singleValue } = req.query;

		// Validate columnKey parameter
		if (columnKey && !isValidProcedureColumnKey(columnKey as string)) {
			return res.status(400).json({
				message: `Invalid columnKey parameter.`
			});
		}
		// Validate slug parameter
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
			singleValue: singleValue === 'true'
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
