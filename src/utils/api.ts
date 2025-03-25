import useSWR from 'swr';
import { parse as superJSONParse, stringify } from 'superjson';
import { ProcedureWithFieldsAndEditions } from '@/pages/api/procedures/types';
import { Edition, OldProcedure } from '@prisma/client';
import { RecordData } from '@/pages/api/administrations-central';

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

export function useDepartments(kind: 'base' | 'old' = 'base') {
	const { data, error, isLoading } = useSWR(
		`/api/departments?kind=${kind}`,
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

export function useAdministrationsCentral() {
	const { data, error, isLoading } = useSWR(
		`/api/administrations-central`,
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
