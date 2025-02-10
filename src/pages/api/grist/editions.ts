import { NextApiRequest, NextApiResponse } from 'next';
import { api } from '../../../utils/grist';

const getEditions = async (_req: NextApiRequest, res: NextApiResponse) => {
	const jwtCookie =
		_req.cookies[process.env.NEXT_PUBLIC_JWT_COOKIE_NAME ?? 'obs-jwt'];
	if (!jwtCookie) {
		return res.status(401).json({ msg: 'You shall not pass.' });
	}

	try {
		let editions: { name: string; start_date: string; end_date: string }[] = [];

		const gristEditions = await api.fetchTable(process.env.GRIST_TABLE_EDITION);

		gristEditions.forEach((edition: any) => {
			editions.push({
				name: edition['Nom_Edition'],
				start_date: edition['Date_Debut'],
				end_date: edition['Date_Fin']
			});
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
