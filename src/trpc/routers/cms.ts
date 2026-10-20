import { cachedCms } from '@/utils/data-cache';
import { publicProcedure, router } from '../trpc';

export const cms = router({
	home: publicProcedure.query(async ({ ctx }) => {
		const homeCms = await cachedCms('cms:home', () =>
			ctx.payload.findGlobal({
				slug: 'home'
			})
		);

		return {
			data: homeCms
		};
	}),
	help: publicProcedure.query(async ({ ctx }) => {
		const helpCms = await cachedCms('cms:help', () =>
			ctx.payload.findGlobal({
				slug: 'help'
			})
		);

		return {
			data: helpCms
		};
	}),
	footer: publicProcedure.query(async ({ ctx }) => {
		const footerCms = await cachedCms('cms:footer', () =>
			ctx.payload.findGlobal({
				slug: 'footer'
			})
		);

		return {
			data: footerCms
		};
	}),
	legals: publicProcedure.query(async ({ ctx }) => {
		const legalsCms = await cachedCms('cms:legals', () =>
			ctx.payload.findGlobal({
				slug: 'legals'
			})
		);

		return {
			data: legalsCms
		};
	})
});
