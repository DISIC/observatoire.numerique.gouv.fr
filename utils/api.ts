import useSWR from 'swr';
import { parse as superJSONParse, stringify } from 'superjson';
import { ProcedureWithFields } from '@/pages/api/procedures/types';
import { ProcedureHeader, Edition } from '@prisma/client';

type ProceduresProps = {
	editionId?: string;
	search?: string;
};

export function useProcedures({ editionId, search }: ProceduresProps) {
	const { data, error } = useSWR(
		`/api/procedures?${editionId ? `editionId=${editionId}` : ''}${
			editionId && search ? '&' : ''
		}${search ? `search=${search}` : ''}`,
		async function (input: RequestInfo, init?: RequestInit) {
			const res = await fetch(input, init);
			return superJSONParse<ProcedureWithFields[]>(stringify(await res.json()));
		}
	);

	return {
		data,
		isError: error,
		isLoading: !error && !data
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
