import { router } from './trpc';
import { cms } from './routers/cms';
export const appRouter = router({
	cms
});

export type AppRouter = typeof appRouter;
