import { NextApiRequest, NextApiResponse } from 'next';
import { tableEditions } from '../../../utils/airtable';

const getEditions = async (_req: NextApiRequest, res: NextApiResponse) => {
	const jwtCookie =
		_req.cookies[process.env.NEXT_PUBLIC_JWT_COOKIE_NAME ?? 'obs-jwt'];
	if (!jwtCookie) {
		return res.status(401).json({ msg: 'You shall not pass.' });
	}

	try {
		let editions: { name: string; start_date: string; end_date: string }[] = [];
		await tableEditions
			.select({})
			.eachPage((records: any[], fetchNextPage: () => void) => {
				records.forEach(record => {
					editions.push({
						name: record.get('Name'),
						start_date: record.get('[Dashlord] - JDMA à partir de'),
						end_date: record.get("[Dashlord] - JDMA jusqu'à")
					});
				});
				fetchNextPage();
			});
		res.status(200).json({
			data: editions
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Something went wrong! 😕' });
	}
};

export default getEditions;
