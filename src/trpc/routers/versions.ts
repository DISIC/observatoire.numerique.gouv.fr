import { publicProcedure, router } from '../trpc';

export const versions = router({
	getList: publicProcedure.query(async ({ ctx }) => {
		const versions = await ctx.payload.find({
			collection: 'payload-versions',
			limit: 100,
			sort: 'number'
		});

		return {
			data: versions.docs
		};
	})
});
