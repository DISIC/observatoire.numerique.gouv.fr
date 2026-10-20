import { prisma } from '@/utils/prisma';
import { getOrLoad } from './server-cache';

const DATA_VERSION_TTL_MS = 5_000;

// Version des données : les ids étant croissants, un import change max(id), une suppression count.
// Permet aux autres instances de voir un import sans attendre le TTL.
async function getDataVersion(): Promise<string> {
	return getOrLoad(
		'data-version',
		async () => {
			const rows = await prisma.$queryRaw<unknown[]>`
				SELECT
					(SELECT count(*)::int FROM "Procedure") AS "procedures",
					(SELECT max(id) FROM "Procedure") AS "maxProcedureId",
					(SELECT count(*)::int FROM "Edition") AS "editions",
					(SELECT max(created_at) FROM "Edition") AS "maxEditionCreatedAt"
			`;
			return JSON.stringify(rows[0]);
		},
		{ ttlMs: DATA_VERSION_TTL_MS }
	);
}

export function cachedData<T>(key: string, loader: () => Promise<T>) {
	return getOrLoad(key, loader, { version: getDataVersion });
}

export function cachedCms<T>(key: string, loader: () => Promise<T>) {
	return getOrLoad(key, loader);
}

export function cacheKey(namespace: string, params: unknown) {
	return `${namespace}:${JSON.stringify(params)}`;
}
