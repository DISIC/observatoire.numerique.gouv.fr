import { router } from './trpc';
import { cms } from './routers/cms';
import { procedureHeaders } from './routers/porcedureHeaders';

export const appRouter = router({
	cms,
	procedureHeaders
});

export type AppRouter = typeof appRouter;
