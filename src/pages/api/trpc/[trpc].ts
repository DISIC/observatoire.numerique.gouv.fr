import * as trpcNext from '@trpc/server/adapters/next';
import { createContext } from '../../../trpc/trpc';
import { appRouter } from '../../../trpc/router';
import {
	NO_STORE_CACHE_CONTROL,
	PUBLIC_CACHE_CONTROL
} from '@/utils/cache-headers';

const PUBLIC_QUERY_PATHS = new Set([
	'cms.home',
	'cms.help',
	'cms.footer',
	'cms.legals',
	'indicators.getList',
	'indicators.getById',
	'versions.getList'
]);

export default trpcNext.createNextApiHandler({
	router: appRouter,
	createContext,
	// Un lot n'est public que si toutes ses requêtes le sont, sans erreur ni utilisateur connecté
	responseMeta({ ctx, paths, type, errors }) {
		const isPublic =
			type === 'query' &&
			errors.length === 0 &&
			!ctx?.user &&
			!!paths?.length &&
			paths.every(path => PUBLIC_QUERY_PATHS.has(path));

		return {
			headers: {
				'Cache-Control': isPublic
					? PUBLIC_CACHE_CONTROL
					: NO_STORE_CACHE_CONTROL
			}
		};
	}
});
