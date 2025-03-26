import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAdministrationsCentral() {
	const administrationCentrals = await prisma.procedure.groupBy({
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

	return administrationCentrals.map(
		administrationCentral =>
			administrationCentral.administration_central as string
	);
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		const administrationCentrals = await getAdministrationsCentral();
		res.status(200).json(administrationCentrals);
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
