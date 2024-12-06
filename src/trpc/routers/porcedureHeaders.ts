import { z } from 'zod';
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
		}),


	getById: publicProcedure
		.input(z.object({
			id: z.string()
		}))
		.query(async ({ ctx, input }) => {
			const { id } = input;

			const procedureHeader = await ctx.payload.findByID({
				collection: 'payload-procedure-headers',
				id
			});

			return {
				data: procedureHeader
			};
		})
});
