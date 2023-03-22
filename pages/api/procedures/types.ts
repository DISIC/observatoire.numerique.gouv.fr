import { FrIconClassName, RiIconClassName } from '@codegouvfr/react-dsfr';
import { z } from 'zod';

export const fieldSlugs = [
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
] as const;
export const ZFieldSlug = z.enum(fieldSlugs);
export type TFieldSlug = z.infer<typeof ZFieldSlug>;

export const fieldColors = [
	'blue',
	'red',
	'orange',
	'yellow',
	'green',
	'gray'
] as const;
export const ZFieldColor = z.enum(fieldColors);
export type TFieldColor = z.infer<typeof ZFieldColor>;

export type TProcedureHeader = {
	slug: TFieldSlug;
	label: string;
	icon: FrIconClassName | RiIconClassName;
};

export const ZProcedureField = z.object({
	slug: ZFieldSlug,
	label: z.string(),
	color: ZFieldColor,
	value: z.number().or(z.string()).optional(),
	noBackground: z.boolean().optional()
});

export const ZProcedure = z.object({
	title: z.string(),
	ministere: z.string(),
	administration: z.string(),
	volume: z.number().optional(),
	fields: z.array(ZProcedureField)
});
export type TProcedure = z.infer<typeof ZProcedure>;
