import useSWR from 'swr';
import { parse as superJSONParse, stringify } from 'superjson';
import { ProcedureWithFields } from '@/pages/api/procedures/types';
import { ProcedureHeader, Edition } from '@prisma/client';

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
			return superJSONParse<ProcedureWithFields[]>(stringify(await res.json()));
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
