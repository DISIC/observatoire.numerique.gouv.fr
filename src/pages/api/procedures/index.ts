import { NextApiRequest, NextApiResponse } from 'next';
import { Field, Prisma, PrismaClient, Procedure } from '@prisma/client';

const prisma = new PrismaClient();

export async function getProcedures(
	editionId?: string,
	search?: string,
	sort?: string,
	department?: string
) {
	let tmpEditionId = editionId;

	if (!tmpEditionId) {
		const editions = await prisma.edition.findMany({
			orderBy: [
				{
					created_at: 'desc'
				}
			]
		});
		tmpEditionId = editions[0]?.id;
	}

	let whereRequest: Prisma.ProcedureWhereInput = {
		editionId: tmpEditionId || null,
		ministere: department && department !== 'all' ? department : undefined
	};

	if (search)
		whereRequest.OR = [
			{ title: { contains: search, mode: 'insensitive' } },
			{ title_normalized: { contains: search, mode: 'insensitive' } },
			{ ministere: { contains: search, mode: 'insensitive' } },
			{ sousorg: { contains: search, mode: 'insensitive' } },
			{ administration: { contains: search, mode: 'insensitive' } }
		];

	let orderBy: any = [{ volume: 'desc' }];

	if (sort) {
		const values = sort.split(':');
		if (values.length === 2) {
			orderBy = [
				{
					[values[0]]: values[1]
				}
			];
		}
	}

	const procedures = await prisma.procedure.findMany({
		orderBy,
		where: whereRequest,
		include: { fields: true, edition: true }
	});

	return procedures;
}

export async function getProcedureById(id: string) {
	const procedure = await prisma.procedure.findUnique({
		where: { id },
		include: { fields: true }
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
		include: { fields: true }
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
		include: { fields: true, edition: true }
	});
	return procedure;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (['POST', 'PUT', 'DELETE'].includes(req.method || '')) {
		const jwtCookie =
			req.cookies[process.env.NEXT_PUBLIC_JWT_COOKIE_NAME ?? 'obs-jwt'];
		if (!jwtCookie) {
			return res.status(401).json({ msg: 'You shall not pass.' });
		}
	}

	if (req.method === 'GET') {
		const { id, editionId, search, sort, department } = req.query;
		if (id) {
			const procedure = await getProcedureById(id.toString());
			res.status(200).json(procedure);
		} else {
			const procedures = await getProcedures(
				editionId as string,
				search as string,
				sort as string,
				department as string
			);
			res.status(200).json(procedures);
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
		res.status(201).json(procedure);
	} else if (req.method === 'PUT') {
		const { id } = req.query;

		const { fields, ...rest } = req.body;
		const procedure = await updateProcedure(id as string, {
			...rest,
			fields: { create: fields }
		});
		res.status(200).json(procedure);
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
