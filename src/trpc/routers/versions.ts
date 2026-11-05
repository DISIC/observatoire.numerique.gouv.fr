import { publicProcedure, router } from '../trpc';
import { cachedCms } from '@/utils/data-cache';

export const versions = router({
	getList: publicProcedure.query(async ({ ctx }) => {
		const docs = await cachedCms(
			'versions:list',
			async () =>
				(
					await ctx.payload.find({
						collection: 'payload-versions',
						limit: 100,
						sort: 'number'
					})
				).docs
		);

		return {
			data: docs
		};
	})
});
