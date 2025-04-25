import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { ZGetListParams } from '../types';

export const indicators = router({
	getList: publicProcedure
		.input(ZGetListParams)
		.query(async ({ ctx, input }) => {
			const { page, perPage } = input;

			const indicators = await ctx.payload.find({
				collection: 'payload-indicators',
				limit: perPage,
				page: page,
				sort: 'position'
			});

			return {
				data: indicators.docs
			};
		}),

	getById: publicProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.query(async ({ ctx, input }) => {
			const { id } = input;

			const indicator = await ctx.payload.findByID({
				collection: 'payload-indicators',
				id
			});

			return {
				data: indicator
			};
		})
});
