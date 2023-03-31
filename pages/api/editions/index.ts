import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Edition } from '@prisma/client';

const prisma = new PrismaClient();

export async function getEditions() {
	const editions = await prisma.edition.findMany({});
	return editions;
}

export async function getEditionById(id: string) {
	const edition = await prisma.edition.findUnique({
		where: { id }
	});
	return edition;
}

export async function createEdition(data: Omit<Edition, 'id'>) {
	const edition = await prisma.edition.create({
		data
	});
	return edition;
}

export async function updateEdition(id: string, data: Edition) {
	const edition = await prisma.edition.update({
		where: { id },
		data
	});
	return edition;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		const { id } = req.query;
		if (id) {
			const edition = await getEditionById(id.toString());
			res.status(200).json(edition);
		} else {
			const editions = await getEditions();
			res.status(200).json(editions);
		}
	} else if (req.method === 'POST') {
		const data = JSON.parse(req.body);
		const edition = await createEdition(data);
		res.status(201).json(edition);
	} else if (req.method === 'PUT') {
		const { id } = req.query;

		const data = req.body;
		const edition = await updateEdition(id as string, data);
		res.status(200).json(edition);
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
