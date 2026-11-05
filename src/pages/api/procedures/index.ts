import { NextApiRequest, NextApiResponse } from 'next';
import {
	setNoStoreHeaders,
	setPublicCacheHeaders
} from '@/utils/cache-headers';
import { Field, Prisma, Procedure } from '@prisma/client';
import { isValidObjectId, parseProcedureSort, verifyAuth } from '@/utils/tools';
import { orderByNullsLikeMongo } from '@/utils/prisma-order';
import { prisma } from '@/utils/prisma';
import { getLastEdition } from '@/utils/editions-server';
import { invalidateServerCache } from '@/utils/server-cache';

export async function getProcedures(
	editionId?: string,
	search?: string,
	sort?: string,
	department?: string,
	administration?: string,
	administration_central?: string
) {
	let tmpEditionId = editionId;

	if (!tmpEditionId) {
		tmpEditionId = (await getLastEdition())?.id;
	}

	let whereRequest: Prisma.ProcedureWhereInput = {
		editionId: tmpEditionId || null,
		ministere: department && department !== 'all' ? department : undefined,
		administration:
			administration && administration !== 'all' ? administration : undefined,
		administration_central:
			administration_central && administration_central !== 'all'
				? administration_central
				: undefined
	};

	if (search)
		whereRequest.OR = [
			{ title: { contains: search, mode: 'insensitive' } },
			{ title_normalized: { contains: search, mode: 'insensitive' } },
			{ ministere: { contains: search, mode: 'insensitive' } },
			{ sousorg: { contains: search, mode: 'insensitive' } },
			{ administration: { contains: search, mode: 'insensitive' } }
		];

	// id en dernier : ordre stable entre ex æquo
	let orderBy: Prisma.ProcedureOrderByWithRelationInput[] = [
		orderByNullsLikeMongo('Procedure', 'volume', 'desc'),
		{ id: 'asc' }
	];

	if (sort) {
		const parsed = parseProcedureSort(sort);
		if (parsed) {
			orderBy = [
				orderByNullsLikeMongo('Procedure', parsed.field, parsed.direction),
				{ id: 'asc' }
			];
		}
	}

	const procedures = await prisma.procedure.findMany({
		orderBy,
		where: whereRequest,
		include: { fields: { orderBy: { id: 'asc' } } }
	});

	return procedures;
}

export async function getProcedureById(id: string) {
	const procedure = await prisma.procedure.findUnique({
		where: { id },
		include: { fields: { orderBy: { id: 'asc' } } }
	});
	return procedure;
}

export async function createProcedure(data: Omit<Procedure, 'id'>) {
	const { editionId, ...rest } = data;
	const procedure = await prisma.procedure.create({
		data: {
			...rest,
			edition: { connect: { id: editionId as string } }
		},
		include: { fields: { orderBy: { id: 'asc' } } }
	});
	return procedure;
}

export async function updateProcedure(id: string, data: Procedure) {
	const { editionId, ...rest } = data;
	const procedure = await prisma.procedure.update({
		where: { id },
		data: {
			...rest,
			edition: { connect: { id: editionId as string } }
		},
		include: { fields: { orderBy: { id: 'asc' } }, edition: true }
	});
	return procedure;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	setNoStoreHeaders(res);
	const protectedMethods = ['POST', 'PUT', 'DELETE']; // You can customize this per route
	const isAuthorized = await verifyAuth(req, { protectedMethods });
	if (!isAuthorized && protectedMethods.includes(req.method || '')) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	if (req.method === 'GET') {
		const {
			id,
			editionId,
			search,
			sort,
			department,
			administration,
			administration_central
		} = req.query;
		try {
			if (id !== undefined) {
				if (!isValidObjectId(id)) {
					return res.status(400).json({ message: 'Invalid id' });
				}
				const procedure = await getProcedureById(id);
				setPublicCacheHeaders(res);
				return res.status(200).json(procedure);
			}
			if (editionId !== undefined && !isValidObjectId(editionId)) {
				return res.status(400).json({ message: 'Invalid editionId' });
			}
			const procedures = await getProcedures(
				editionId as string | undefined,
				typeof search === 'string' ? search : undefined,
				typeof sort === 'string' ? sort : undefined,
				typeof department === 'string' ? department : undefined,
				typeof administration === 'string' ? administration : undefined,
				typeof administration_central === 'string'
					? administration_central
					: undefined
			);
			setPublicCacheHeaders(res);
			return res.status(200).json(procedures);
		} catch (err) {
			console.error('GET /api/procedures failed:', err);
			return res.status(500).json({ message: 'Internal error' });
		}
	} else if (req.method === 'POST') {
		const { fields, id, ...rest } = JSON.parse(req.body);
		const createFields = fields.map((f: Field) => {
			const { id, procedureId, ...rest } = f;
			return rest;
		});
		const procedure = await createProcedure({
			...rest,
			fields: { create: createFields }
		});
		// Import Grist : les agrégats sont à recalculer
		invalidateServerCache();
		res.status(201).json(procedure);
	} else if (req.method === 'PUT') {
		const { id } = req.query;

		const { fields, ...rest } = req.body;
		const procedure = await updateProcedure(id as string, {
			...rest,
			fields: { create: fields }
		});
		invalidateServerCache();
		res.status(200).json(procedure);
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
