import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getPayload } from 'payload';
import config from '@payload-config';
import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';
import { getPayloadJWTSecret } from '@/utils/tools';

type CreateContextOptions = {
	payloadClient: Awaited<ReturnType<typeof getPayload>>;
	user: any | null;
};

const createInnerContext = async (opts: CreateContextOptions) => {
	return {
		payload: opts.payloadClient,
		user: opts.user
	};
};

export const createContext = async (opts: CreateNextContextOptions) => {
	const payloadClient = await getPayload({ config });

	const jwtCookie = opts.req.cookies[process.env.NEXT_PUBLIC_JWT_COOKIE_NAME ?? 'obs-jwt'];

	if (!jwtCookie) {
		return await createInnerContext({
			payloadClient,
			user: null
		});
	}

	try {
		const secret = process.env.PAYLOAD_SECRET;
		if (!secret) {
			throw new Error('PAYLOAD_SECRET is not defined');
		}

		const derivedSecret = getPayloadJWTSecret(secret);
		const decoded = jwt.verify(jwtCookie, derivedSecret, {
			algorithms: ["HS256"],
		});

		if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
			const user = await payloadClient.findByID({
				collection: 'payload-admins',
				id: decoded.id as string
			});

			return await createInnerContext({
				payloadClient,
				user
			});
		}

		return await createInnerContext({
			payloadClient,
			user: null
		});
	} catch (error) {
		return await createInnerContext({
			payloadClient,
			user: null
		});
	}
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
			message: 'You must be logged in to access this resource',
		});
	}

	return next({
		ctx: {
			user: ctx.user,
		},
	});
});

export const protectedProcedure = t.procedure.use(isAuthed);