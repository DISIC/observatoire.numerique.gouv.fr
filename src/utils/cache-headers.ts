import type { NextApiResponse } from 'next';

export const PUBLIC_CACHE_CONTROL =
	'public, s-maxage=300, stale-while-revalidate=3600';
export const NO_STORE_CACHE_CONTROL = 'no-store';

export function setPublicCacheHeaders(res: NextApiResponse) {
	res.setHeader('Cache-Control', PUBLIC_CACHE_CONTROL);
}

export function setNoStoreHeaders(res: NextApiResponse) {
	res.setHeader('Cache-Control', NO_STORE_CACHE_CONTROL);
}
