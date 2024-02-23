import useSWR from 'swr';
import { parse as superJSONParse, stringify } from 'superjson';
import { ProcedureWithFieldsAndEditions } from '@/pages/api/procedures/types';
import { ProcedureHeader, Edition, User, OldProcedure } from '@prisma/client';

type OldProceduresProps = {
	xwiki_edition: string;
	search?: string;
	sort?: string;
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

export function useProcedureHeaders() {
	const { data, error } = useSWR(
		`/api/procedure-headers`,
		async function (input: RequestInfo, init?: RequestInit) {
			const res = await fetch(input, init);
			return superJSONParse<ProcedureHeader[]>(stringify(await res.json()));
		}
	);

	return {
		data,
		isError: error,
		isLoading: !error && !data
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

export function useUsers(page: number, numberPerPage: number) {
	const { data, error, mutate } = useSWR(
		`/api/users?page=${page}&numberPerPage=${numberPerPage}`,
		async function (input: RequestInfo, init?: RequestInit) {
			const res = await fetch(input, init);
			return superJSONParse<{ data: User[]; metadata: { count: number } }>(
				stringify(await res.json())
			);
		}
	);

	return {
		data,
		mutate,
		isError: error,
		isLoading: !error && !data
	};
}

export function useEdition(id: String) {
	const { data, error } = useSWR(
		`/api/editions?id=${id}`,
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
