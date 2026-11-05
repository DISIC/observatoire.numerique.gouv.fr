import { NextApiRequest, NextApiResponse } from 'next';
import { Edition, Prisma } from '@prisma/client';
import { z } from 'zod';
import { desufligyText, isValidObjectId, verifyAuth } from '@/utils/tools';
import { prisma } from '@/utils/prisma';
import { invalidateServerCache } from '@/utils/server-cache';

export async function getEditions() {
	const editions = await prisma.edition.findMany({
		orderBy: [
			{
				created_at: 'desc'
			}
		]
	});
	return editions;
}

export async function getEditionById(id: string) {
	const edition = await prisma.edition.findUnique({
		where: { id }
	});
	return edition;
}

export async function getEditionBySlug(slug: string) {
	const edition = await prisma.edition.findFirst({
		where: {
			name: {
				contains: desufligyText(slug),
				mode: 'insensitive'
			}
		}
	});
	return edition;
}

export async function getCurrentEdition() {
	const edition = await prisma.edition.findFirst({
		orderBy: [
			{
				created_at: 'desc'
			}
		]
	});
	return edition;
}

export async function createEdition(data: Omit<Edition, 'id'>) {
	const edition = await prisma.edition.create({
		data
	});
	invalidateServerCache();
	return edition;
}

export async function updateEdition(
	id: string,
	data: Partial<Omit<Edition, 'id'>>
) {
	const edition = await prisma.edition.update({
		where: { id },
		data
	});
	// Un renommage ne change pas la version des données (cf. data-cache) : invalidation explicite
	invalidateServerCache();
	return edition;
}

// Supprime dans l'ordre Field > Procedure > Edition pour ne pas laisser d'orphelins
export async function deleteEdition(id: string) {
	const procedures = await prisma.procedure.findMany({
		where: { editionId: id },
		select: { id: true }
	});
	const procedureIds = procedures.map(procedure => procedure.id);

	await prisma.field.deleteMany({
		where: { procedureId: { in: procedureIds } }
	});
	await prisma.procedure.deleteMany({
		where: { id: { in: procedureIds } }
	});
	const edition = await prisma.edition.delete({
		where: { id }
	});
	invalidateServerCache();
	return edition;
}

const editionFields = {
	name: z.string().trim().min(1).max(200),
	start_date: z.coerce.date(),
	end_date: z.coerce.date(),
	created_at: z.coerce.date(),
	version: z.number().int().min(1).max(1000)
};

const createEditionSchema = z
	.object({
		...editionFields,
		created_at: editionFields.created_at.optional(),
		version: editionFields.version.optional()
	})
	.strict()
	.refine(data => data.end_date >= data.start_date, {
		message: 'end_date must be after start_date'
	});

const updateEditionSchema = z
	.object(editionFields)
	.partial()
	.strict()
	.refine(data => Object.keys(data).length > 0, {
		message: 'Empty update'
	});

// Le BO envoie du JSON sans Content-Type (corps reçu en chaîne).
const parseJsonBody = (body: unknown): unknown => {
	if (typeof body !== 'string') return body;
	try {
		return JSON.parse(body);
	} catch {
		return undefined;
	}
};

const sendWriteError = (
	res: NextApiResponse,
	method: string | undefined,
	err: unknown
) => {
	if (
		err instanceof Prisma.PrismaClientKnownRequestError &&
		['P2002', 'P2003', 'P2025'].includes(err.code)
	) {
		return res.status(400).json({ message: 'Invalid request' });
	}
	console.error(`${method} /api/editions failed:`, err);
	return res.status(500).json({ message: 'Internal error' });
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const protectedMethods = ['POST', 'PUT', 'DELETE'];
	const isAuthorized = await verifyAuth(req, { protectedMethods });
	if (!isAuthorized && protectedMethods.includes(req.method || '')) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	if (req.method === 'GET') {
		const { id, kind } = req.query;
		try {
			if (id !== undefined) {
				if (typeof id !== 'string') {
					return res.status(400).json({ message: 'Invalid id' });
				}
				if (id === 'current') {
					const edition = await getCurrentEdition();
					return res.status(200).json(edition);
				}
				if (kind === 'id') {
					if (!isValidObjectId(id)) {
						return res.status(400).json({ message: 'Invalid id' });
					}
					const edition = await getEditionById(id);
					return res.status(200).json(edition);
				}
				const edition = await getEditionBySlug(id);
				return res.status(200).json(edition);
			}
			const editions = await getEditions();
			return res.status(200).json(editions);
		} catch (err) {
			console.error('GET /api/editions failed:', err);
			return res.status(500).json({ message: 'Internal error' });
		}
	} else if (req.method === 'POST') {
		const parsed = createEditionSchema.safeParse(parseJsonBody(req.body));
		if (!parsed.success) {
			return res.status(400).json({ message: 'Invalid body' });
		}
		try {
			const { created_at, ...data } = parsed.data;
			const edition = await createEdition({
				...data,
				created_at: created_at ?? new Date(),
				version: data.version ?? 2
			});
			return res.status(201).json(edition);
		} catch (err) {
			return sendWriteError(res, req.method, err);
		}
	} else if (req.method === 'PUT') {
		const { id } = req.query;
		if (!isValidObjectId(id)) {
			return res.status(400).json({ message: 'Invalid id' });
		}
		const parsed = updateEditionSchema.safeParse(parseJsonBody(req.body));
		if (!parsed.success) {
			return res.status(400).json({ message: 'Invalid body' });
		}
		try {
			const edition = await updateEdition(id, parsed.data);
			return res.status(200).json(edition);
		} catch (err) {
			return sendWriteError(res, req.method, err);
		}
	} else if (req.method === 'DELETE') {
		const { id } = req.query;
		if (!isValidObjectId(id)) {
			return res.status(400).json({ message: 'Invalid id' });
		}
		try {
			const edition = await deleteEdition(id);
			return res.status(200).json(edition);
		} catch (err) {
			return sendWriteError(res, req.method, err);
		}
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
