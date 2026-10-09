import { router } from './trpc';
import { cms } from './routers/cms';
import { indicators } from './routers/indicators';
import { admins } from './routers/admins';
import { grist } from './routers/grist';
import { versions } from './routers/versions';
import { editions } from './routers/editions';

export const appRouter = router({
	cms,
	indicators,
	admins,
	grist,
	versions,
	editions
});

export type AppRouter = typeof appRouter;
