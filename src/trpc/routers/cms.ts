import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { Home } from '@/payload/payload-types';

export const cms = router({
	home: publicProcedure
		.query(async ({ ctx, input }) => {
			const homeCms = await ctx.payload.findGlobal({
				slug: 'home',
			});

			return {
				data: homeCms
			};
		}),
});