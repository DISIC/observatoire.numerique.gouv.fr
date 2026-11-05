import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { ZGetListParams } from '../types';
import { cacheKey, cachedCms } from '@/utils/data-cache';

export const indicators = router({
	getList: publicProcedure
		.input(ZGetListParams)
		.query(async ({ ctx, input }) => {
			const { page, perPage } = input;

			const docs = await cachedCms(
				cacheKey('indicators:list', { page, perPage }),
				async () =>
					(
						await ctx.payload.find({
							collection: 'payload-indicators',
							limit: perPage,
							page: page,
							sort: 'position'
						})
					).docs
			);

			return {
				data: docs
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
