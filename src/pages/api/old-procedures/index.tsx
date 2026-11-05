import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import {
	setNoStoreHeaders,
	setPublicCacheHeaders
} from '@/utils/cache-headers';
import { orderByNullsLikeMongo } from '@/utils/prisma-order';
import { prisma } from '@/utils/prisma';

const OLD_PROCEDURE_SORT_FIELDS = [
	'title',
	'statutDemat',
	'satisfactionIndex_value',
	'accessibilityScore_display',
	'qualiteSupport',
	'adapteMobile_display',
	'franceConnect_display',
	'ditesLeNousUneFois_value',
	'urlScore_value',
	'volumetrie_value'
] as const;

type OldProcedureSort = {
	field: (typeof OLD_PROCEDURE_SORT_FIELDS)[number];
	direction: 'asc' | 'desc';
};

const parseOldProcedureSort = (value: string): OldProcedureSort | null => {
	const [field, direction] = value.split(':');
	if (
		!(OLD_PROCEDURE_SORT_FIELDS as readonly string[]).includes(field) ||
		(direction !== 'asc' && direction !== 'desc')
	) {
		return null;
	}
	return { field: field as OldProcedureSort['field'], direction };
};

export async function getOldProcedures(
	xwiki_edition: string,
	search?: string,
	sort?: OldProcedureSort,
	department?: string
) {
	let whereRequest: Prisma.OldProcedureWhereInput = {
		xwiki_edition: xwiki_edition,
		ministere: department && department !== 'all' ? department : undefined
	};

	if (search)
		whereRequest.OR = [
			{ title: { contains: search, mode: 'insensitive' } },
			{ ministere: { contains: search, mode: 'insensitive' } }
		];

	const orderBy: Prisma.OldProcedureOrderByWithRelationInput[] = [
		orderByNullsLikeMongo(
			'OldProcedure',
			sort?.field ?? 'volumetrie_value',
			sort?.direction ?? 'desc'
		),
		{ id: 'asc' }
	];

	const oldProcedures = await prisma.oldProcedure.findMany({
		orderBy,
		where: whereRequest
	});
	return oldProcedures;
}

const optionalString = (value: unknown): value is string | undefined =>
	value === undefined || typeof value === 'string';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	setNoStoreHeaders(res);
	if (req.method !== 'GET') {
		return res.status(400).json({ message: 'Unsupported method' });
	}

	const { xwiki_edition, search, sort, department } = req.query;
	if (
		typeof xwiki_edition !== 'string' ||
		!optionalString(search) ||
		!optionalString(department) ||
		!optionalString(sort)
	) {
		return res.status(400).json({ message: 'Invalid parameters' });
	}

	const parsedSort = sort ? parseOldProcedureSort(sort) : null;
	if (sort && !parsedSort) {
		return res.status(400).json({ message: 'Invalid sort' });
	}

	try {
		const oldProcedures = await getOldProcedures(
			xwiki_edition,
			search,
			parsedSort ?? undefined,
			department
		);
		setPublicCacheHeaders(res);
		return res.status(200).json(oldProcedures);
	} catch (err) {
		console.error('GET /api/old-procedures failed:', err);
		return res.status(500).json({ message: 'Internal error' });
	}
}
