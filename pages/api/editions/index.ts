import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Edition } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

const prisma = new PrismaClient();

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
	console.log(id);
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

export async function deleteEdition(id: string) {
	const edition = await prisma.edition.delete({
		where: { id }
	});
	await prisma.procedure.deleteMany({
		where: { editionId: id }
	});
	return edition;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (['POST', 'PUT', 'DELETE'].includes(req.method || '')) {
		const token = await getToken({
			cookieName: process.env.NEXTAUTH_COOKIENAME,
			req,
			secret: process.env.JWT_SECRET
		});
		if (!token || (token.exp as number) > new Date().getTime())
			return res.status(401).json({ msg: 'You shall not pass.' });
	}

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
	} else if (req.method === 'DELETE') {
		const { id } = req.query;
		const edition = await deleteEdition(id as string);
		res.status(200).json(edition);
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
