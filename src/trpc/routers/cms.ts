import { publicProcedure, router } from '../trpc';

export const cms = router({
	home: publicProcedure.query(async ({ ctx, input }) => {
		const homeCms = await ctx.payload.findGlobal({
			slug: 'home'
		});

		return {
			data: homeCms
		};
	}),
	help: publicProcedure.query(async ({ ctx, input }) => {
		const helpCms = await ctx.payload.findGlobal({
			slug: 'help'
		});

		return {
			data: helpCms
		};
	}),
	footer: publicProcedure.query(async ({ ctx, input }) => {
		const footerCms = await ctx.payload.findGlobal({
			slug: 'footer'
		});

		return {
			data: footerCms
		};
	}),
	legals: publicProcedure.query(async ({ ctx, input }) => {
		const legalsCms = await ctx.payload.findGlobal({
			slug: 'legals'
		});

		return {
			data: legalsCms
		};
	})
});
