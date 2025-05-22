import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { RecordData, validIndicatorSlugs } from '@/utils/data-viz';
import { ProcedureKind } from '../indicator-scores';

export type EvolutionViewType = 'year' | 'edition';

export type GetIndicatorEvolutionProps = {
	view: EvolutionViewType;
	slug: (typeof validIndicatorSlugs)[number];
	kind: ProcedureKind;
	value: string;
};

const prisma = new PrismaClient();

// have 2 views: per year and per edition
// in both cases, we need to group the field by edition
export async function getIndicatorEvolution({
	view,
	slug,
	kind,
	value
}: GetIndicatorEvolutionProps) {}

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
		const administrationsCentral = await getIndicatorEvolution({
			view: view as EvolutionViewType,
			slug: slug as (typeof validIndicatorSlugs)[number],
			kind: kind as ProcedureKind,
			value: value as string
		});
		res.status(200).json(administrationsCentral);
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
