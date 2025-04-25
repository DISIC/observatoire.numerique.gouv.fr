import * as trpcNext from '@trpc/server/adapters/next';
import { createContext } from '../../../trpc/trpc';
import { appRouter } from '../../../trpc/router';

export default trpcNext.createNextApiHandler({
	router: appRouter,
	createContext
});
