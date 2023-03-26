import useSWR from 'swr';
import { parse as superJSONParse, stringify } from 'superjson';
import { ProcedureWithFields } from '@/pages/api/procedures/types';
import { ProcedureHeader } from '@prisma/client';
import { string } from 'zod';

export function useProcedures() {
	const { data, error } = useSWR(
		`/api/procedures`,
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
