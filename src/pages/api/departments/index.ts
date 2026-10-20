import { NextApiRequest, NextApiResponse } from 'next';
import {
	setNoStoreHeaders,
	setPublicCacheHeaders
} from '@/utils/cache-headers';
import { Prisma } from '@prisma/client';
import { prisma } from '@/utils/prisma';
import { isValidObjectId } from '@/utils/tools';

const DEPARTMENT_KINDS = ['base', 'old'] as const;
type DepartmentKind = (typeof DEPARTMENT_KINDS)[number];

const isDepartmentKind = (value: unknown): value is DepartmentKind =>
	typeof value === 'string' &&
	(DEPARTMENT_KINDS as readonly string[]).includes(value);

export async function getDepartments(
	kind: DepartmentKind = 'base',
	editionId?: string
) {
	const where: Prisma.ProcedureWhereInput = {};

	if (editionId) {
		where.editionId = editionId;
	}

	const departments =
		kind === 'old'
			? await prisma.oldProcedure.groupBy({
					by: ['ministere'],
					orderBy: {
						ministere: 'asc'
					}
			  })
			: await prisma.procedure.groupBy({
					by: ['ministere'],
					where,
					orderBy: {
						ministere: 'asc'
					}
			  });
	return departments.map(department => department.ministere);
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	setNoStoreHeaders(res);
	if (req.method !== 'GET') {
		return res.status(400).json({ message: 'Unsupported method' });
	}

	const { kind, editionId } = req.query;
	if (kind !== undefined && !isDepartmentKind(kind)) {
		return res.status(400).json({ message: 'Invalid kind' });
	}
	if (editionId !== undefined && !isValidObjectId(editionId)) {
		return res.status(400).json({ message: 'Invalid editionId' });
	}

	try {
		const departments = await getDepartments(kind, editionId);
		setPublicCacheHeaders(res);
		return res.status(200).json(departments);
	} catch (err) {
		console.error('GET /api/departments failed:', err);
		return res.status(500).json({ message: 'Internal error' });
	}
}
