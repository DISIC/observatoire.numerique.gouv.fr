import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { ProcedureKind } from '../indicator-scores';
import getPayloadClient from '@/payload/payload-client';
import {
	isValidIndicatorSlug,
	isValidProcedureKind,
	validIndicatorSlugs,
	validProcedureKinds
} from '@/utils/data-viz-client';

export type EvolutionViewType = 'year' | 'edition';

export type GetIndicatorEvolutionProps = {
	view: EvolutionViewType;
	slug: (typeof validIndicatorSlugs)[number];
	kind?: ProcedureKind;
	kindValue?: string;
	procedureId?: string;
};

export type DataLevel = {
	label: string;
	color?: string;
	position?: number;
	description?: string;
};

export type RecordDataGrouped = {
	name: string;
	values: (DataLevel & { value: number })[];
};

export async function getIndicatorEvolution({
	view,
	slug,
	kind,
	kindValue,
	procedureId
}: GetIndicatorEvolutionProps): Promise<RecordDataGrouped[] | null> {
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
		take: view === 'edition' ? 5 : undefined
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
						[kind ? kind : 'id']: kind ? kindValue : procedureId
					},
					select: {
						id: true
					}
				});

				const fields = await prisma.field.findMany({
					where: {
						slug: {
							equals: slug
						},
						procedureId: {
							in: procedures.map(procedure => procedure.id)
						}
					}
				});

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

		return result;
	}

	const data = await Promise.all(
		editions.map(async edition => {
			const procedures = await prisma.procedure.findMany({
				where: {
					editionId: edition.id,
					[kind ? kind : 'id']: kind ? kindValue : procedureId
				},
				select: {
					id: true
				}
			});

			const fields = await prisma.field.findMany({
				where: {
					slug: {
						equals: slug
					},
					procedureId: {
						in: procedures.map(procedure => procedure.id)
					}
				}
			});

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

	return result;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		if (!req.query.view || !req.query.slug) {
			return res.status(400).json({
				message: 'Missing view or slug query parameter.'
			});
		}

		const { view, slug, kind, kindValue, procedureId } = req.query;

		// Validate kind parameter
		if (kind && !isValidProcedureKind(kind as string)) {
			return res.status(400).json({
				message: `Invalid kind parameter. Must be one of: ${validProcedureKinds.join(
					', '
				)}`
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
			kind: kind as ProcedureKind,
			kindValue: kindValue as string,
			procedureId: procedureId as string
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
