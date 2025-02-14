import { router } from './trpc';
import { cms } from './routers/cms';
import { indicators } from './routers/indicators';
import { admins } from './routers/admins';
import { grist } from './routers/grist';

export const appRouter = router({
	cms,
	indicators,
	admins,
	grist
});

export type AppRouter = typeof appRouter;
