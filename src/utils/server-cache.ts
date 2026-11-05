// Stockage sur globalThis : l'app router (hooks Payload) et le pages router (API) sont
// compilés séparément. Ne jamais y mettre de réponse dépendant de l'utilisateur.

export const DEFAULT_CACHE_TTL_MS = 10 * 60_000;
const MAX_ENTRIES = 1000;

type Entry = {
	promise: Promise<unknown>;
	expiresAt: number;
	version: string | undefined;
};

type CacheState = { entries: Map<string, Entry> };

const globalForCache = globalThis as unknown as {
	__observatoireServerCache?: CacheState;
};

const state: CacheState = (globalForCache.__observatoireServerCache ??= {
	entries: new Map()
});

export type CacheOptions = {
	ttlMs?: number;
	version?: () => Promise<string>;
};

export async function getOrLoad<T>(
	key: string,
	loader: () => Promise<T>,
	{ ttlMs = DEFAULT_CACHE_TTL_MS, version }: CacheOptions = {}
): Promise<T> {
	const currentVersion = version ? await version() : undefined;
	const now = Date.now();

	const existing = state.entries.get(key);
	if (
		existing &&
		existing.expiresAt > now &&
		existing.version === currentVersion
	) {
		return existing.promise as Promise<T>;
	}

	const promise = loader();
	const entry: Entry = {
		promise,
		expiresAt: now + ttlMs,
		version: currentVersion
	};

	state.entries.delete(key);
	state.entries.set(key, entry);
	while (state.entries.size > MAX_ENTRIES) {
		const oldestKey = state.entries.keys().next().value;
		if (oldestKey === undefined) break;
		state.entries.delete(oldestKey);
	}

	promise.catch(() => {
		if (state.entries.get(key) === entry) state.entries.delete(key);
	});

	return promise;
}

export function invalidateServerCache() {
	state.entries.clear();
}
