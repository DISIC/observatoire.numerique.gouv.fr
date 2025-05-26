import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { validIndicatorSlugs } from '@/utils/data-viz';
import { ProcedureKind } from '../indicator-scores';
import getPayloadClient from '@/payload/payload-client';

const validProcedureKinds: ProcedureKind[] = [
	'administration',
	'administration_central',
	'ministere'
];

function isValidProcedureKind(kind: string): kind is ProcedureKind {
	return validProcedureKinds.includes(kind as ProcedureKind);
}

export type EvolutionViewType = 'year' | 'edition';

export type GetIndicatorEvolutionProps = {
	view: EvolutionViewType;
	slug: (typeof validIndicatorSlugs)[number];
	kind: ProcedureKind;
	value: string;
};

export async function getIndicatorEvolution({
	view,
	slug,
	kind,
	value
}: GetIndicatorEvolutionProps) {
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
		take: 5
	});

	// example: { "April 2023": [ { level: "good", count: 3 }, { level: "bad", count: 1 }... ], ...  }
	const data = await Promise.all(
		editions.map(async edition => {
			const procedures = await prisma.procedure.findMany({
				where: {
					editionId: edition.id,
					[kind]: value
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

					const count = fields.filter(
						field => field.color === level.color
					).length;
					return {
						level: level.label_stats,
						count: count
					};
				})
				.filter(item => item !== null);

			return {
				edition: edition.name,
				levels: levelCounts
			};
		})
	);

	const result = data.reduce((acc, editionData) => {
		acc[editionData.edition] = editionData.levels;
		return acc;
	}, {} as Record<string, Array<{ level: string; count: number }>>);

	return result;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		if (
			!req.query.view ||
			!req.query.slug ||
			!req.query.kind ||
			!req.query.value
		) {
			return res.status(400).json({
				message: 'Missing view, slug, kind or value query parameter.'
			});
		}

		const { view, slug, kind, value } = req.query;

		// Validate kind parameter
		if (!isValidProcedureKind(kind as string)) {
			return res.status(400).json({
				message: `Invalid kind parameter. Must be one of: ${validProcedureKinds.join(
					', '
				)}`
			});
		}

		const administrationsCentral = await getIndicatorEvolution({
			view: view as EvolutionViewType,
			slug: slug as (typeof validIndicatorSlugs)[number],
			kind: kind as ProcedureKind,
			value: value as string
		});

		if (!administrationsCentral) {
			return res.status(404).json({
				message: 'No data found for the given parameters.'
			});
		}
		res.status(200).json(administrationsCentral);
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
