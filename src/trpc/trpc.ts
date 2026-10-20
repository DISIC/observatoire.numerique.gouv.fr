import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getPayload } from 'payload';
import config from '@payload-config';
import { ZodError } from 'zod';
import { getAdminFromRequest } from '@/utils/admin-auth';

type CreateContextOptions = {
	payloadClient: Awaited<ReturnType<typeof getPayload>>;
	user: Awaited<ReturnType<typeof getAdminFromRequest>>;
	res: CreateNextContextOptions['res'];
};

const createInnerContext = async (opts: CreateContextOptions) => {
	return {
		payload: opts.payloadClient,
		user: opts.user,
		res: opts.res
	};
};

export const createContext = async (opts: CreateNextContextOptions) => {
	const payloadClient = await getPayload({ config });

	const user = await getAdminFromRequest(opts.req, payloadClient);

	return await createInnerContext({
		payloadClient,
		user,
		res: opts.res
	});
};

const t = initTRPC.context<typeof createContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError: error.cause instanceof ZodError ? error.cause.flatten() : null
			}
		};
	}
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

const isAuthed = middleware(({ ctx, next }) => {
	if (!ctx.user) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'You must be logged in to access this resource'
		});
	}

	return next({
		ctx: {
			user: ctx.user
		}
	});
});

export const protectedProcedure = t.procedure.use(isAuthed);
