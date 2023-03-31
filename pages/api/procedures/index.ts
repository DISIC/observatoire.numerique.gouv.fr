import { NextApiRequest, NextApiResponse } from 'next';
import { Field, PrismaClient, Procedure } from '@prisma/client';

const prisma = new PrismaClient();

export async function getProcedures() {
	const editions = await prisma.edition.findMany({
		orderBy: [
			{
				created_at: 'desc'
			}
		]
	});

	const procedures = await prisma.procedure.findMany({
		where: { editionId: editions[0]?.id || null },
		include: { fields: true }
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
	if (req.method === 'GET') {
		const { id } = req.query;
		if (id) {
			const procedure = await getProcedureById(id.toString());
			res.status(200).json(procedure);
		} else {
			const procedures = await getProcedures();
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
