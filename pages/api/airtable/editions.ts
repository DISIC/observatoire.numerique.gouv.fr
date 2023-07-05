import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { tableEditions } from '../../../utils/airtable';

const getEditions = async (_req: NextApiRequest, res: NextApiResponse) => {
	const token = await getToken({
		req: _req,
		secret: process.env.JWT_SECRET
	});
	if (!token || (token.exp as number) > new Date().getTime())
		return res.status(401).json({ msg: 'You shall not pass.' });

	try {
		let editions: string[] = [];
		await tableEditions
			.select({})
			.eachPage((records: any[], fetchNextPage: () => void) => {
				records.forEach(record => {
					editions.push(record.get('Name'));
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
