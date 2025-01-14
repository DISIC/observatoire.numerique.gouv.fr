import { ProcedureHeaderSort } from "@/components/top250/table/ProceduresTable";
import { ProcedureWithFields } from "@/pages/api/procedures/types";

export const getDisplayedVolume = (volume: number): string => {
	if (volume >= 1000000) {
		const millions = Math.floor(volume / 1000000);
		const remainder = volume % 1000000;
		if (remainder === 0) {
			return `${millions} million${millions > 1 ? 's' : ''}`;
		} else {
			const thousands = Math.round(remainder / 100000);
			const units = remainder % 1000;
			if (thousands === 0) {
				return `${millions}.${Math.floor(units / 100)} million${millions > 1 ? 's' : ''
					}`;
			} else {
				return `${millions}.${thousands} million${millions > 1 ? 's' : ''}`;
			}
		}
	} else {
		const numString = volume.toString();
		const parts = [];
		for (let i = numString.length - 1; i >= 0; i -= 3) {
			const chunk = numString.slice(Math.max(i - 2, 0), i + 1);
			parts.unshift(chunk);
		}
		return parts.join(' ');
	}
};

export function getNbPages(count: number, numberPerPage: number) {
	return count % numberPerPage === 0
		? count / numberPerPage
		: Math.trunc(count / numberPerPage) + 1;
}

export function formatDateToFrenchString(tmpDate: string) {
	const date = new Date(tmpDate);

	if (!(date instanceof Date)) {
		throw new Error('Input is not a valid Date object');
	}

	const formatter = new Intl.DateTimeFormat('fr-FR', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric'
	});

	return formatter.format(date);
}

export function ISODateFormatToSimplifiedDate(inputDate: string) {
	const dateObj = new Date(inputDate);

	const year = dateObj.getUTCFullYear();
	const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0');
	const day = dateObj.getUTCDate().toString().padStart(2, '0');

	const formattedDate = `${year}-${month}-${day}`;

	return formattedDate;
}

const IGNORED_VALUES = ["Non applicable", "Nombre d'avis insuffisant", "En attente", 'À venir', "0", "–"] as string[];
const SPECIAL_VALUES = ["Faible", "Non", "Partiel", "Déploiement local", "Oui", "Optimal", "FranceConnect", "FranceConnect+"];
export const sortProcedures = (
	procedures: ProcedureWithFields[],
	sortConfig: ProcedureHeaderSort | null
): ProcedureWithFields[] => {
	if (!sortConfig) return procedures;

	return [...procedures].sort((a, b) => {
		let valueA = a.fields.find((f) => f.slug === sortConfig.slug)?.value ??
			a.fields.find((f) => f.slug === sortConfig.slug)?.label ??
			'0';
		let valueB = b.fields.find((f) => f.slug === sortConfig.slug)?.value ??
			b.fields.find((f) => f.slug === sortConfig.slug)?.label ??
			'0';

		if (valueA === 'NaN' || valueA.startsWith('http')) {
			valueA = a.fields.find((f) => f.slug === sortConfig.slug)?.label ??
				'0';
		}

		if (valueB === 'NaN' || valueB.startsWith('http')) {
			valueB = b.fields.find((f) => f.slug === sortConfig.slug)?.label ??
				'0';
		}

		// Si les deux valeurs sont ignorées, on les trie selon leur ordre dans IGNORED_VALUES
		if (IGNORED_VALUES.includes(valueA as string) && IGNORED_VALUES.includes(valueB as string)) {
			return IGNORED_VALUES.indexOf(valueA as string) - IGNORED_VALUES.indexOf(valueB as string);
		}

		// Si une seule valeur est ignorée, elle va toujours à la fin
		if (IGNORED_VALUES.includes(valueA as string)) return 1;
		if (IGNORED_VALUES.includes(valueB as string)) return -1;

		// Si les deux valeurs sont spéciales, on les trie selon leur ordre dans SPECIAL_VALUES
		if (SPECIAL_VALUES.includes(valueA as string) && SPECIAL_VALUES.includes(valueB as string)) {
			return sortConfig.direction === 'asc' ? SPECIAL_VALUES.indexOf(valueA as string) - SPECIAL_VALUES.indexOf(valueB as string) : SPECIAL_VALUES.indexOf(valueB as string) - SPECIAL_VALUES.indexOf(valueA as string);
		}

		const valueToCompareA = isNaN(Number(valueA)) ? valueA : Number(valueA);
		const valueToCompareB = isNaN(Number(valueB)) ? valueB : Number(valueB);

		if (typeof valueToCompareA === 'number' && typeof valueToCompareB === 'number') {
			return sortConfig.direction === 'asc'
				? valueToCompareA - valueToCompareB
				: valueToCompareB - valueToCompareA;
		}

		if (typeof valueToCompareA === 'string' && typeof valueToCompareB === 'string') {
			return sortConfig.direction === 'asc'
				? valueToCompareA.localeCompare(valueToCompareB)
				: valueToCompareB.localeCompare(valueToCompareA);
		}

		return sortConfig.direction === 'asc'
			? String(valueToCompareA).localeCompare(String(valueToCompareB))
			: String(valueToCompareB).localeCompare(String(valueToCompareA));
	});
};