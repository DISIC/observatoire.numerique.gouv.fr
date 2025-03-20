import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAdministrationsCentral() {
	const administrationsCentral = await prisma.procedure.groupBy({
		by: ['administration_central'],
		where: {
			administration_central: {
				not: null
			}
		},
		orderBy: {
			administration_central: 'asc'
		}
	});
	return administrationsCentral.map(
		administrationCentral =>
			administrationCentral.administration_central as string
	);
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		const administrationsCentral = await getAdministrationsCentral();
		res.status(200).json(administrationsCentral);
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
