import { publicProcedure, router } from '../trpc';
import { ZGetListParams } from '../types';

export const procedureHeaders = router({
	getList: publicProcedure
		.input(ZGetListParams)
		.query(async ({ ctx, input }) => {
			const { page, perPage } = input;

			const procedureHeaders = await ctx.payload.find({
				collection: 'payload-procedure-headers',
				limit: perPage,
				page: page,
				sort: 'position'
			});

			return {
				data: procedureHeaders.docs
			};
		})
});
