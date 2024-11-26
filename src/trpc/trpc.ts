import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getPayload } from 'payload';
import config from '@payload-config'
import { ZodError } from 'zod';

type CreateContextOptions = {
	payloadClient: Awaited<ReturnType<typeof getPayload>>;
};

const createInnerContext = async (opts: CreateContextOptions) => {
	return {
		payload: opts.payloadClient,
	};
};

export const createContext = async (opts: CreateNextContextOptions) => {
	const payloadClient = await getPayload({ config });

	return await createInnerContext({ payloadClient });
};

const t = initTRPC.context<typeof createContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		};
	},
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;