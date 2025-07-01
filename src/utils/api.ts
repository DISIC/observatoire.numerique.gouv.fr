import useSWR from 'swr';
import { parse as superJSONParse, stringify } from 'superjson';
import { ProcedureWithFieldsAndEditions } from '@/pages/api/procedures/types';
import { Edition, OldProcedure } from '@prisma/client';
import { ProcedureKind } from '@/pages/api/indicator-scores';
import {
	GetIndicatorEvolutionProps,
	RecordDataGrouped
} from '@/pages/api/indicator-evolution';
import { RecordData } from './data-viz-client';

type OldProceduresProps = {
	xwiki_edition: string;
	search?: string;
	sort?: string;
	department?: string;
};
export function useOldProcedures(props: OldProceduresProps) {
	// REMOVE UNDEFINED TO AVOID ISSUES IN URLSEARCHPARAMS
	const fakeProps: { [key: string]: any } = props;
	Object.keys(fakeProps).forEach(
		key => fakeProps[key] === undefined && delete fakeProps[key]
	);

	const searchUrl = new URLSearchParams(fakeProps);
	const { data, error, isLoading } = useSWR(
		`/api/old-procedures?${searchUrl}`,
		async function (input: RequestInfo, init?: RequestInit) {
			const res = await fetch(input, init);
			return superJSONParse<OldProcedure[]>(stringify(await res.json()));
		}
	);

	return {
		data,
		isError: error,
		isLoading: (!error && !data) || isLoading
	};
}

type ProceduresProps = {
	editionId?: string;
	search?: string;
	sort?: string;
	department?: string;
	administration?: string;
	administration_central?: string;
};
export function useProcedures(props: ProceduresProps) {
	// REMOVE UNDEFINED TO AVOID ISSUES IN URLSEARCHPARAMS
	const fakeProps: { [key: string]: any } = props;
	Object.keys(fakeProps).forEach(
		key => fakeProps[key] === undefined && delete fakeProps[key]
	);

	const searchUrl = new URLSearchParams(fakeProps);
	const { data, error, isLoading } = useSWR(
		`/api/procedures?${searchUrl}`,
		async function (input: RequestInfo, init?: RequestInit) {
			const res = await fetch(input, init);
			return superJSONParse<ProcedureWithFieldsAndEditions[]>(
				stringify(await res.json())
			);
		}
	);

	return {
		data,
		isError: error,
		isLoading: (!error && !data) || isLoading
	};
}

export function useProcedureById(id: string) {
	const { data, error, isLoading } = useSWR(
		id ? `/api/procedures?id=${id}` : null,
		async function (input: RequestInfo, init?: RequestInit) {
			const res = await fetch(input, init);
			return superJSONParse<ProcedureWithFieldsAndEditions>(
				stringify(await res.json())
			);
		}
	);

	return {
		data,
		isError: error,
		isLoading: (!error && !data) || isLoading
	};
}

export function useEditions() {
	const { data, error } = useSWR(
		`/api/editions`,
		async function (input: RequestInfo, init?: RequestInit) {
			const res = await fetch(input, init);
			return superJSONParse<Edition[]>(stringify(await res.json()));
		}
	);

	return {
		data,
		isError: error,
		isLoading: !error && !data
	};
}

type EditionProps = {
	id?: string;
	kind: 'id' | 'slug';
};

export function useEdition(props: EditionProps) {
	const { id, kind } = props;
	const { data, error } = useSWR(
		id ? `/api/editions?id=${id}&kind=${kind}` : null,
		async function (input: RequestInfo, init?: RequestInit) {
			const res = await fetch(input, init);
			return superJSONParse<Edition>(stringify(await res.json()));
		}
	);

	return {
		data,
		isError: error,
		isLoading: !error && !data
	};
}

export function useDepartments(
	kind: 'base' | 'old' = 'base',
	editionId: string | undefined
) {
	const { data, error, isLoading } = useSWR(
		`/api/departments?kind=${kind}${
			editionId ? `&editionId=${editionId}` : ''
		}`,
		async function (input: RequestInfo, init?: RequestInit) {
			const res = await fetch(input, init);
			return superJSONParse<string[]>(stringify(await res.json()));
		}
	);

	return {
		data: data || [],
		isError: error,
		isLoading: (!error && !data) || isLoading
	};
}

export function useAdministrations() {
	const { data, error, isLoading } = useSWR(
		`/api/administrations`,
		async function (input: RequestInfo, init?: RequestInit) {
			const res = await fetch(input, init);
			return superJSONParse<string[]>(stringify(await res.json()));
		}
	);

	return {
		data: data || [],
		isError: error,
		isLoading: (!error && !data) || isLoading
	};
}

export function useProcedureGroupByKind({ kind }: { kind: ProcedureKind }) {
	const { data, error, isLoading } = useSWR(
		`/api/procedure-group?kind=${kind}`,
		async function (input: RequestInfo, init?: RequestInit) {
			const res = await fetch(input, init);
			return superJSONParse<string[]>(stringify(await res.json()));
		}
	);

	return {
		data: data || [],
		isError: error,
		isLoading: (!error && !data) || isLoading
	};
}

type IndicatorScoreByProcedureKindProps = {
	kind: ProcedureKind;
	search?: string;
};

export function useIndicatorScoreByProcedureKind({
	kind,
	search
}: IndicatorScoreByProcedureKindProps) {
	const { data, error, isLoading } = useSWR(
		`/api/indicator-scores?kind=${kind}${
			search ? `&search=${encodeURIComponent(search)}` : ''
		}`,
		async function (input: RequestInfo, init?: RequestInit) {
			const res = await fetch(input, init);
			return superJSONParse<RecordData[]>(stringify(await res.json()));
		}
	);

	return {
		data: data || [],
		isError: error,
		isLoading: (!error && !data) || isLoading
	};
}

type IndicatorScoreByProcedureKindSlugProps = {
	kind: ProcedureKind;
	slug: string;
};

export function useIndicatorScoreByProcedureKindSlug({
	kind,
	slug
}: IndicatorScoreByProcedureKindSlugProps) {
	const { data, error, isLoading } = useSWR(
		`/api/indicator-scores?kind=${kind}&slug=${slug}`,
		async function (input: RequestInfo, init?: RequestInit) {
			const res = await fetch(input, init);
			return superJSONParse<RecordData>(stringify(await res.json()));
		}
	);

	return {
		data: data,
		isError: error,
		isLoading: (!error && !data) || isLoading
	};
}

export function useAdministrationsCentral() {
	const { data, error, isLoading } = useSWR(
		`/api/administrations-central`,
		async function (input: RequestInfo, init?: RequestInit) {
			const res = await fetch(input, init);
			return superJSONParse<string[]>(stringify(await res.json()));
		}
	);

	return {
		data: data || [],
		isError: error,
		isLoading: (!error && !data) || isLoading
	};
}

export function useIndicatorEvolution({
	view,
	slug,
	kind,
	kindValue,
	procedureId
}: GetIndicatorEvolutionProps) {
	const { data, error, isLoading } = useSWR(
		kind && kindValue
			? `/api/indicator-evolution?view=${view}&slug=${slug}&kind=${kind}&value=${kindValue}`
			: procedureId
			? `/api/indicator-evolution?view=${view}&slug=${slug}&procedureId=${procedureId}`
			: null,
		async function (input: RequestInfo, init?: RequestInit) {
			const res = await fetch(input, init);
			return superJSONParse<RecordDataGrouped[]>(stringify(await res.json()));
		}
	);

	return {
		data: data || [],
		isError: error,
		isLoading: (!error && !data) || isLoading
	};
}
