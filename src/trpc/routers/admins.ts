import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';

export const admins = router({
	verifyCredentials: publicProcedure
		.input(
			z.object({
				email: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { email } = input;

			try {
				const admins = await ctx.payload.find({
					collection: 'payload-admins',
					where: { email: { equals: email } }
				});
				const admin = admins.docs[0];

				if (!admin) {
					throw new TRPCError({
						code: 'UNAUTHORIZED',
						message: 'Invalid email or password'
					});
				}

				const hasOTP = Boolean(admin.totpSecret);

				return {
					hasOTP
				};
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Unknown error',
					cause: error
				});
			}
		}),

	login: publicProcedure
		.input(
			z.object({
				email: z.string(),
				password: z.string(),
				totpSecret: z.string().optional(),
				totp: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { email, password, totpSecret, totp } = input;

			try {
				const admin = await ctx.payload.login({
					collection: 'payload-admins',
					data: {
						email,
						password
					},
					context: {
						totp,
						totpSecret
					}
				});

				return {
					data: admin
				};
			} catch (error) {
				if (error && typeof error === 'object') {
					if (
						('status' in error && error.status === 401) ||
						('message' in error && error.message === 'Invalid TOTP')
					) {
						throw new TRPCError({
							code: 'UNAUTHORIZED',
							message: 'Invalid email or password',
							cause: error
						});
					}
				}

				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Unknown error',
					cause: error
				});
			}
		})
});
