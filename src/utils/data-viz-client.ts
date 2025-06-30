// Client-safe utilities for data visualization
// This file contains only client-side safe code without any Node.js dependencies

import { ProcedureKind } from '@/pages/api/indicator-scores';

export const validIndicatorSlugs = [
	'satisfaction',
	'handicap',
	'dlnuf',
	'auth',
	'simplicity'
] as const;

export function isValidIndicatorSlug(
	slug: string
): slug is (typeof validIndicatorSlugs)[number] {
	return validIndicatorSlugs.includes(
		slug as (typeof validIndicatorSlugs)[number]
	);
}

export const validProcedureKinds: ProcedureKind[] = [
	'administration',
	'administration_central',
	'ministere'
] as const;

export function isValidProcedureKind(kind: string): kind is ProcedureKind {
	return validProcedureKinds.includes(kind as ProcedureKind);
}

export type RecordData = {
	text: string;
	count: number;
	data: {
		score: number;
		goal: number;
		cross: number;
		slug: string;
		name: string;
		icon: string;
	}[];
};
