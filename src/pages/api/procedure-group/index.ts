import { NextApiRequest, NextApiResponse } from 'next';
import {
	setNoStoreHeaders,
	setPublicCacheHeaders
} from '@/utils/cache-headers';
import { ProcedureKind } from '../indicator-scores';
import { prisma } from '@/utils/prisma';
import { isProcedureKind } from '@/utils/tools';
import { getLastEdition } from '@/utils/editions-server';

export async function getProcedureGroupByKind(kind: ProcedureKind) {
	const lastEdition = await getLastEdition();
	if (!lastEdition) return [];

	const group = await prisma.procedure.groupBy({
		by: [kind],
		where: { editionId: lastEdition.id }
	});

	return group
		.map(group => group[kind])
		.filter((value): value is string => value !== null)
		.sort((a, b) => a.localeCompare(b));
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	setNoStoreHeaders(res);
	if (req.method !== 'GET') {
		return res.status(400).json({ message: 'Unsupported method' });
	}

	const { kind } = req.query;
	if (!isProcedureKind(kind)) {
		return res.status(400).json({ message: 'Invalid kind' });
	}

	try {
		const groupByProcedureKind = await getProcedureGroupByKind(kind);
		setPublicCacheHeaders(res);
		return res.status(200).json(groupByProcedureKind);
	} catch (err) {
		console.error('GET /api/procedure-group failed:', err);
		return res.status(500).json({ message: 'Internal error' });
	}
}
