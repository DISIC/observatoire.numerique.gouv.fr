import { NextApiRequest, NextApiResponse } from 'next';
import { table } from '../../../utils/airtable';

const getDemarches = async (_req: NextApiRequest, res: NextApiResponse) => {
	try {
		const records = await table.select({}).firstPage();
		res.status(200).json(records);
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Something went wrong! 😕' });
	}
};

export default getDemarches;
