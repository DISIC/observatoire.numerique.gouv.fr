import type { NextApiRequest, NextApiResponse } from 'next';
import * as trpcNext from '@trpc/server/adapters/next';
import { createContext } from '../../../trpc/trpc';
import { appRouter } from '../../../trpc/router';
import { isJsonRequest } from '@/utils/tools';

const trpcHandler = trpcNext.createNextApiHandler({
	router: appRouter,
	createContext
});

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST' && !isJsonRequest(req)) {
		return res.status(415).json({ message: 'Unsupported Media Type' });
	}
	return trpcHandler(req, res);
}
