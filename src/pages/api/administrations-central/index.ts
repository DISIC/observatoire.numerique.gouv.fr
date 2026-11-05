import { NextApiRequest, NextApiResponse } from 'next';
import {
	setNoStoreHeaders,
	setPublicCacheHeaders
} from '@/utils/cache-headers';
import { prisma } from '@/utils/prisma';
import { isValidObjectId } from '@/utils/tools';
import { getLastEdition } from '@/utils/editions-server';

export async function getAdministrationsCentral(editionId?: string) {
	const targetEditionId = editionId ?? (await getLastEdition())?.id;
	if (!targetEditionId) return [];

	const administrationCentrals = await prisma.procedure.groupBy({
		by: ['administration_central'],
		where: {
			editionId: targetEditionId,
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
	setNoStoreHeaders(res);
	if (req.method !== 'GET') {
		return res.status(400).json({ message: 'Unsupported method' });
	}

	const { editionId } = req.query;
	if (editionId !== undefined && !isValidObjectId(editionId)) {
		return res.status(400).json({ message: 'Invalid editionId' });
	}

	try {
		const administrationCentrals = await getAdministrationsCentral(editionId);
		setPublicCacheHeaders(res);
		return res.status(200).json(administrationCentrals);
	} catch (err) {
		console.error('GET /api/administrations-central failed:', err);
		return res.status(500).json({ message: 'Internal error' });
	}
}
