import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/prisma';

// Derrière oauth2-proxy : OAUTH2_PROXY_SKIP_AUTH_ROUTES="GET=^/api/health$"
const DB_TIMEOUT_MS = 3000;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	res.setHeader('Cache-Control', 'no-store');

	if (req.method !== 'GET' && req.method !== 'HEAD') {
		res.setHeader('Allow', 'GET, HEAD');
		return res.status(405).end();
	}

	try {
		await Promise.race([
			prisma.$queryRaw`SELECT 1`,
			new Promise((_, reject) =>
				setTimeout(() => reject(new Error('timeout')), DB_TIMEOUT_MS)
			)
		]);
		return res.status(200).json({ status: 'ok' });
	} catch (e) {
		console.error('healthcheck: base de données indisponible', e);
		return res.status(503).json({ status: 'error' });
	}
}
