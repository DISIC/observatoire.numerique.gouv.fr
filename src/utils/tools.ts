import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';
import { ProcedureHeaderSort } from '@/components/top250/table/ProceduresTable';
import { ProcedureWithFields } from '@/pages/api/procedures/types';
import { format, isSameMonth, isSameYear } from 'date-fns';
import { fr } from 'date-fns/locale';
import { fr as frDsfr } from '@codegouvfr/react-dsfr';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { ProcedureKind } from '@/pages/api/indicator-scores';
import { validIndicatorSlugs } from './data-viz-client';

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
				return `${millions}.${Math.floor(units / 100)} million${
					millions > 1 ? 's' : ''
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

const IGNORED_VALUES = [
	'Non applicable',
	"Nombre d'avis insuffisant",
	'En attente',
	'À venir',
	'0',
	'–',
	'-'
] as string[];
const SPECIAL_VALUES = [
	'Faible',
	'Non',
	'Partiel',
	'Déploiement local',
	'Oui',
	'Optimal',
	'FranceConnect',
	'FranceConnect+'
];
export const sortProcedures = (
	procedures: ProcedureWithFields[],
	sortConfig: ProcedureHeaderSort | null
): ProcedureWithFields[] => {
	if (!sortConfig) return procedures;

	return [...procedures].sort((a, b) => {
		const aField = a.fields.find(f => f.slug === sortConfig.slug);
		const bField = b.fields.find(f => f.slug === sortConfig.slug);

		let valueA = aField?.value ?? aField?.label ?? '0';
		let valueB = bField?.value ?? bField?.label ?? '0';

		if (aField?.slug === 'dlnuf') {
			valueA = aField?.label ?? '0';
		}
		if (bField?.slug === 'dlnuf') {
			valueB = bField?.label ?? '0';
		}

		if (
			aField?.slug === 'handicap' &&
			aField.label === 'Non' &&
			(aField.value === null || aField.value === 'Non')
		) {
			valueA = '1';
		}

		if (
			bField?.slug === 'handicap' &&
			bField.label === 'Non' &&
			bField.value === null
		) {
			valueB = '1';
		}

		if (valueA === 'NaN' || valueA.startsWith('http')) {
			valueA = aField?.label ?? '0';
		}

		if (valueB === 'NaN' || valueB.startsWith('http')) {
			valueB = bField?.label ?? '0';
		}

		// Si les deux valeurs sont ignorées, on les trie selon leur ordre dans IGNORED_VALUES
		if (
			IGNORED_VALUES.includes(valueA as string) &&
			IGNORED_VALUES.includes(valueB as string)
		) {
			return (
				IGNORED_VALUES.indexOf(valueA as string) -
				IGNORED_VALUES.indexOf(valueB as string)
			);
		}

		// Si une seule valeur est ignorée, elle va toujours à la fin
		if (IGNORED_VALUES.includes(valueA as string)) return 1;
		if (IGNORED_VALUES.includes(valueB as string)) return -1;

		// Si les deux valeurs sont spéciales, on les trie selon leur ordre dans SPECIAL_VALUES
		if (
			SPECIAL_VALUES.includes(valueA as string) &&
			SPECIAL_VALUES.includes(valueB as string)
		) {
			return sortConfig.direction === 'asc'
				? SPECIAL_VALUES.indexOf(valueA as string) -
						SPECIAL_VALUES.indexOf(valueB as string)
				: SPECIAL_VALUES.indexOf(valueB as string) -
						SPECIAL_VALUES.indexOf(valueA as string);
		}

		const valueToCompareA = isNaN(Number(valueA)) ? valueA : Number(valueA);
		const valueToCompareB = isNaN(Number(valueB)) ? valueB : Number(valueB);

		if (
			typeof valueToCompareA === 'number' &&
			typeof valueToCompareB === 'number'
		) {
			return sortConfig.direction === 'asc'
				? valueToCompareA - valueToCompareB
				: valueToCompareB - valueToCompareA;
		}

		if (
			typeof valueToCompareA === 'string' &&
			typeof valueToCompareB === 'string'
		) {
			return sortConfig.direction === 'asc'
				? valueToCompareA.localeCompare(valueToCompareB)
				: valueToCompareB.localeCompare(valueToCompareA);
		}

		return sortConfig.direction === 'asc'
			? String(valueToCompareA).localeCompare(String(valueToCompareB))
			: String(valueToCompareB).localeCompare(String(valueToCompareA));
	});
};

/**
 * Formats a date range in French showing months and years when necessary
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date
 * @returns {string} Formatted date range like "de juillet à septembre 2023" or "de décembre 2022 à février 2023"
 */
export const formatDateRangeFR = (startDate: Date, endDate: Date) => {
	if (!(startDate instanceof Date && endDate instanceof Date)) {
		throw new Error('Invalid date objects');
	}

	// Format months in lowercase French
	const startMonth = format(startDate, 'MMMM', { locale: fr }).toLowerCase();
	const endMonth = format(endDate, 'MMMM', { locale: fr }).toLowerCase();

	// Get years
	const startYear = format(startDate, 'yyyy');
	const endYear = format(endDate, 'yyyy');

	// Same month and year
	if (isSameMonth(startDate, endDate)) {
		return `En ${startMonth}`;
	}

	// Same year but different months
	if (isSameYear(startDate, endDate)) {
		return `De ${startMonth} à ${endMonth}`;
	}

	// Different years
	return `De ${startMonth} ${startYear} à ${endMonth} ${endYear}`;
};

export function getPayloadJWTSecret(payloadSecret: string): string {
	return crypto
		.createHash('sha256')
		.update(payloadSecret)
		.digest('hex')
		.slice(0, 32);
}

interface AuthOptions {
	protectedMethods?: string[];
}
export async function verifyAuth(
	req: NextApiRequest,
	options: AuthOptions = {}
): Promise<boolean> {
	const protectedMethods = options.protectedMethods || [
		'POST',
		'PUT',
		'DELETE'
	];

	if (!protectedMethods.includes(req.method || '')) {
		return true;
	}

	const jwtCookie =
		req.cookies[process.env.NEXT_PUBLIC_JWT_COOKIE_NAME ?? 'obs-jwt'];

	if (!jwtCookie) {
		return false;
	}

	try {
		const secret = process.env.PAYLOAD_SECRET;
		if (!secret) {
			throw new Error('PAYLOAD_SECRET is not defined');
		}

		const derivedSecret = getPayloadJWTSecret(secret);
		const decoded = jwt.verify(jwtCookie, derivedSecret, {
			algorithms: ['HS256']
		});
		return typeof decoded === 'object' && decoded !== null;
	} catch (error) {
		return false;
	}
}

export const slugifyText = (text: string): string => {
	return text.toLowerCase().replace(/\s+/g, '-');
};

export const desufligyText = (text: string): string => {
	const result = text.replace(/-/g, ' ');
	return result.charAt(0).toUpperCase() + result.slice(1);
};

export const exportChartAsImage = (chartParent: HTMLElement, title: string) => {
	const chartSVG = chartParent.children[0] as SVGElement;

	if (!chartSVG) {
		console.error('Chart SVG element not found');
		return;
	}

	const filename = `export-${slugifyText(title)}-${new Date()
		.toISOString()
		.slice(0, 10)}`;
	const svgURL = new XMLSerializer().serializeToString(chartSVG);
	const svgBlob = new Blob([svgURL], { type: 'image/svg+xml;charset=utf-8' });
	saveAs(svgBlob, `${filename}.svg`);
};

export const exportChartAsPng = async (chartParent: HTMLElement) => {
	const chartSVG = chartParent.children[0] as HTMLElement;

	if (!chartSVG) {
		console.error('Chart SVG element not found');
		return;
	}

	const canvas = await html2canvas(chartSVG, {
		logging: false,
		useCORS: true,
		allowTaint: true
	});

	const pngBlob = await new Promise<Blob>((resolve, reject) => {
		canvas.toBlob(blob => {
			if (blob) {
				resolve(blob);
			} else {
				reject(new Error('Failed to create PNG blob'));
			}
		}, 'image/png');
	});

	if (pngBlob) {
		const filename = `export-${slugifyText(
			chartSVG.getAttribute('title') || 'chart'
		)}-${new Date().toISOString().slice(0, 10)}.png`;
		saveAs(pngBlob, filename);
	}
};

export function stringToBase64Url(str: string): string {
	const base64 = btoa(unescape(encodeURIComponent(str)));
	return encodeURIComponent(base64);
}

export function base64UrlToString(base64Url: string): string {
	const decoded = decodeURIComponent(base64Url);
	return decodeURIComponent(escape(atob(decoded)));
}

export function exportTableAsCSV(tableSelector: string, title: string) {
	const rows = document.querySelectorAll<HTMLTableRowElement>(
		`${tableSelector} tr`
	);
	const csv: string[] = [];

	rows.forEach(row => {
		const cells = Array.from(row.querySelectorAll('th, td'));
		const rowData = cells.map(cell => {
			const cellClone = cell.cloneNode(true) as HTMLElement;

			cellClone.querySelectorAll('p').forEach(p => p.remove());

			const text = cellClone.textContent?.trim().replace(/"/g, '""') ?? '';

			return `"${text}"`;
		});

		csv.push(rowData.join(','));
	});

	const csvBlob = new Blob([csv.join('\n')], {
		type: 'text/csv;charset=utf-8'
	});
	const filename = `export-${slugifyText(title)}-${new Date()
		.toISOString()
		.slice(0, 10)}.csv`;

	saveAs(csvBlob, filename);
}

export const getProcedureKindLabel = (
	kind: ProcedureKind,
	{ plural = false, uppercaseFirst = false } = {}
): string => {
	let label = '';

	switch (kind) {
		case 'ministere':
			label = 'ministère';
			break;
		case 'administration':
			label = 'administration';
			break;
		case 'administration_central':
			label = 'périmètre';
			break;
		default:
			return '';
	}

	if (plural && label && !label.endsWith('s')) {
		label = `${label}s`;
	}

	if (uppercaseFirst && label) {
		label = label.charAt(0).toUpperCase() + label.slice(1);
	}

	return label;
};

export const getValidIndicatorLabel = (
	kind: (typeof validIndicatorSlugs)[number]
): string => {
	let label = '';

	switch (kind) {
		case 'satisfaction':
			label = 'Satisfaction usager';
			break;
		case 'handicap':
			label = 'Prise en compte du handicap';
			break;
		case 'dlnuf':
			label = 'Dites-le-nous une fois';
			break;
		case 'auth':
			label = 'Authentification';
			break;
		case 'simplicity':
			label = 'Clarté du langage';
			break;
		default:
			return '';
	}

	return label;
};

export const getColorValue = (value?: string) => {
	switch (value) {
		case 'green':
			return frDsfr.colors.getHex({ isDark: false }).decisions.text.default
				.success.default;
		case 'blue':
			return frDsfr.colors.getHex({ isDark: false }).decisions.text.default.info
				.default;
		case 'yellow':
			return frDsfr.colors.getHex({ isDark: false }).options.orangeTerreBattue
				.main645.default;
		case 'red':
			return frDsfr.colors.getHex({ isDark: false }).decisions.text.default
				.error.default;
		case 'gray':
			return frDsfr.colors.getHex({ isDark: false }).decisions.text.default.grey
				.default;
		default:
			return '#000';
	}
};
