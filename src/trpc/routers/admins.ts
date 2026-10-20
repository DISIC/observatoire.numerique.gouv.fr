import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';
import { checkAdminCredentials, loginAdmin } from '@/payload/auth/adminLogin';
import { serializeAuthCookie } from '@/utils/auth-cookie';

const credentialsInput = z.object({
	email: z.string().max(320),
	password: z.string().max(1024)
});

const unauthorized = (cause?: unknown) =>
	new TRPCError({
		code: 'UNAUTHORIZED',
		message: 'Invalid email or password',
		cause
	});

export const admins = router({
	verifyCredentials: publicProcedure
		.input(credentialsInput)
		.mutation(async ({ ctx, input }) => {
			const result = await checkAdminCredentials(ctx.payload, input);

			if (!result.ok) throw unauthorized();

			return result.hasOTP
				? { hasOTP: true as const }
				: { hasOTP: false as const, otpauthUri: result.otpauthUri };
		}),

	login: publicProcedure
		.input(
			credentialsInput.extend({
				totp: z.string().max(16)
			})
		)
		.mutation(async ({ ctx, input }) => {
			let admin: Awaited<ReturnType<typeof loginAdmin>>;
			try {
				admin = await loginAdmin(ctx.payload, input);
			} catch (error) {
				const status =
					error && typeof error === 'object' && 'status' in error
						? error.status
						: undefined;
				const isAuthError =
					typeof status === 'number' && status >= 400 && status < 500;

				if (isAuthError) throw unauthorized(error);

				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Unknown error',
					cause: error
				});
			}

			if (!admin.token) throw unauthorized();

			ctx.res.setHeader(
				'Set-Cookie',
				serializeAuthCookie(admin.token, admin.exp)
			);

			return { success: true };
		})
});
