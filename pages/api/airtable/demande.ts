import { tableDemande } from '@/utils/airtable';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	_req: NextApiRequest,
	res: NextApiResponse
) {
	if (_req.method === 'POST') {
		try {
			const { serviceName, url, remarks } = _req.body;

			const records = await tableDemande.create([
				{
					fields: {
						Name: serviceName,
						URL: url,
						Notes: remarks
					}
				}
			]);

			res.status(200).json({ success: true, data: records });
		} catch (err) {
			res.status(500).json({ success: false, message: (err as any).message });
		}
	} else {
		// Handle any other HTTP method
		res.setHeader('Allow', ['POST']);
		res.status(405).end(`Method ${_req.method} Not Allowed`);
	}
}
