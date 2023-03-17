import { z } from 'zod';

export const ZFieldSlug = z.enum([
	'online',
	'satisfaction',
	'handicap',
	'dlnuf',
	'usage',
	'simplicity',
	'help-reachable',
	'help-used',
	'uptime',
	'performance',
	'auth'
]);

export const ZProcedureField = z.object({
	slug: ZFieldSlug,
	label: z.string(),
	color: z.string(),
	value: z.number().optional(),
	noBackground: z.boolean().optional(),
	link: z.string().optional()
});

export const ZProcedure = z.object({
	title: z.string(),
	ministere: z.string(),
	administration: z.string(),
	fields: z.array(ZProcedureField)
});
export type TProcedure = z.infer<typeof ZProcedure>;
