import { router } from './trpc';
import { cms } from './routers/cms';
import { indicators } from './routers/indicators';
import { admins } from './routers/admins'

export const appRouter = router({
	cms,
	indicators,
	admins
});

export type AppRouter = typeof appRouter;
