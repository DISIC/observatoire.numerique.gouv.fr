import { router } from './trpc';
import { cms } from './routers/cms';
import { indicators } from './routers/indicators';

export const appRouter = router({
	cms,
	indicators
});

export type AppRouter = typeof appRouter;
