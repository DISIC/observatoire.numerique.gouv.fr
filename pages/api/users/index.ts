import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, User } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

const prisma = new PrismaClient();

const userWithoutPassword = (user: User): User => {
	return {
		...user,
		password: 'nice_try'
	}
}

export async function getUsers(page: number, numberPerPage: number) {
	const users = await prisma.user.findMany({
		take: numberPerPage,
		skip: ((page - 1) * numberPerPage),
		orderBy: [
			{
				created_at: 'desc'
			}
		]
	});

	const count = await prisma.user.count({})

	return {
		data: users.map((user) => userWithoutPassword(user)), metadata: { count }
	}
}

export async function getUserById(id: string) {
	const user = await prisma.user.findUnique({
		where: { id }
	});
	return user ? userWithoutPassword(user) : null;
}

export async function createUser(data: Omit<User, 'id'>) {
	const user = await prisma.user.create({
		data
	});
	return userWithoutPassword(user);
}

export async function updateUser(id: string, data: User) {
	const user = await prisma.user.update({
		where: { id },
		data
	});
	return userWithoutPassword(user);
}

export async function deleteUser(id: string) {
	const user = await prisma.user.delete({
		where: { id }
	});
	return userWithoutPassword(user);
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (['POST', 'PUT', 'DELETE'].includes(req.method || '')) {
		const token = await getToken({
			req,
			secret: process.env.JWT_SECRET
		});
		if (!token || (token.exp as number) > new Date().getTime())
			return res.status(401).json({ msg: 'You shall not pass.' });
	}

	if (req.method === 'GET') {
		const { id, page, numberPerPage } = req.query;
		if (id) {
			const user = await getUserById(id.toString());
			res.status(200).json(user);
		} else if (page && numberPerPage) {
			const users = await getUsers(parseInt(page as string), parseInt(numberPerPage as string));
			res.status(200).json(users);
		}
	} else if (req.method === 'POST') {
		const data = JSON.parse(req.body);
		const user = await createUser(data);
		res.status(201).json(user);
	} else if (req.method === 'PUT') {
		const { id } = req.query;

		const data = req.body;
		const user = await updateUser(id as string, data);
		res.status(200).json(user);
	} else if (req.method === 'DELETE') {
		const { id } = JSON.parse(req.body);
		const user = await deleteUser(id as string);
		res.status(200).json(user);
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
