import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';

export const admins = router({
	login: publicProcedure.input(z.object({
		email: z.string(),
		password: z.string()
	})).mutation(async ({ ctx, input }) => {
		const { email, password } = input;

		try {
			const admin = await ctx.payload.login({
				collection: 'payload-admins',
				data: {
					email,
					password
				},
			})

			return {
				data: admin
			};
		} catch (error) {
			if (error && typeof error === "object" && "status" in error) {
				if (error.status === 401) {
					throw new TRPCError({
						code: "UNAUTHORIZED",
						message: "Invalid email or password",
						cause: error,
					});
				}
			}

			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "Unknown error",
				cause: error,
			});
		}
	}),
});
