import { Prisma, PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export async function getOldProcedures(
	xwiki_edition: string,
	search?: string,
	sort?: string
) {
	let whereRequest: Prisma.OldProcedureWhereInput = {
		xwiki_edition: xwiki_edition
	};

	if (search)
		whereRequest.OR = [
			{ title: { contains: search, mode: 'insensitive' } },
			{ ministere: { contains: search, mode: 'insensitive' } }
		];

	let orderBy: any = [{ volumetrie_value: 'desc' }];

	if (sort) {
		const values = sort.split(':');
		if (values.length === 2)
			orderBy = [
				{
					[values[0]]: values[1]
				}
			];
	}

	const oldProcedures = await prisma.oldProcedure.findMany({
		orderBy,
		where: whereRequest
	});
	return oldProcedures;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		const { xwiki_edition, search, sort } = req.query;

		const oldProcedures = await getOldProcedures(
			xwiki_edition as string,
			search as string,
			sort as string
		);

		res.status(200).json(oldProcedures);
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
