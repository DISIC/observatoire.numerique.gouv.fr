import { NextApiRequest, NextApiResponse } from 'next';
import { table } from '../../../utils/airtable';
import { ProcedureWithFields } from '../procedures/types';
import { Field, IndicatorColor, IndicatorSlug } from '@prisma/client';

const field_names = {
	edition: '📡 Édition',
	id: '🕶 ID',
	link: 'Lien',
	title: 'Nom 💼 📄',
	administration: 'Administration',
	sousorg: 'adaz',
	ministere: 'Ministère politique',
	volume: 'Volumétrie totale',
	indicators: {
		online: '📊  En ligne',
		satisfaction: '📊 Note de satisfaction /10',
		simplicity: '[Dashlord] - JDMA note facilité',
		uptime: '📊  Disponibilité et rapidité'
	}
};
const getLabelFromValue = (slug: IndicatorSlug, value: string): string => {
	switch (slug) {
		case 'online':
			return ['Oui', 'Non', 'Partiel', 'Bêta'].includes(value) ? value : 'Non';
		case 'satisfaction':
			return isNaN(parseInt(value)) ? '< 100 votes' : value;
		case 'simplicity':
			const simplicityIntValue = parseInt(value);
			if (isNaN(simplicityIntValue)) return '< 100 votes';
			if (simplicityIntValue < 8) return 'Bonne';
			if (simplicityIntValue < 6) return 'Moyenne';
			if (simplicityIntValue < 4) return 'Mauvaise';
			else return 'Très bonne';
		case 'uptime':
			const uptimeIntValue = parseInt(value);
			console.log(value);
			if (isNaN(uptimeIntValue)) return 'Indéterminée';
			if (uptimeIntValue < 8) return 'Bonne';
			if (uptimeIntValue < 6) return 'Moyenne';
			if (uptimeIntValue < 4) return 'Mauvaise';
			else return 'Très bonne';
		default:
			return value;
	}
};

const getColorFromLabel = (
	slug: IndicatorSlug,
	label: string
): IndicatorColor => {
	switch (slug) {
		case 'online':
			if (label === 'Oui') return 'green';
			else if (label === 'Partiel') return 'orange';
			else if (label === 'Bêta') return 'yellow';
			else return 'red';
		case 'satisfaction':
			const intValue = parseInt(label);
			if (isNaN(intValue)) return 'gray';
			if (intValue < 8) return 'yellow';
			if (intValue < 6) return 'orange';
			if (intValue < 4) return 'red';
			else return 'green';
		case 'simplicity':
			if (label === '< 100 votes') return 'gray';
			if (label === 'Bonne') return 'yellow';
			if (label === 'Moyenne') return 'orange';
			if (label === 'Mauvaise') return 'red';
		case 'uptime':
			if (label === 'Indéterminée') return 'gray';
			if (label === 'Bonne') return 'yellow';
			if (label === 'Moyenne') return 'orange';
			if (label === 'Mauvaise') return 'red';
			else return 'green';
		default:
			return 'gray';
	}
};

const recordToProcedure = (record: any): ProcedureWithFields => {
	// console.log(record);

	let fields: Field[] = [
		{
			id: 'preview',
			slug: 'online',
			label: getLabelFromValue(
				'online',
				record.get(field_names.indicators.online)
			),
			color: getColorFromLabel(
				'online',
				getLabelFromValue('online', record.get(field_names.indicators.online))
			),
			value: record.get(field_names.link),
			procedureId: 'preview',
			noBackground: false
		},
		{
			id: 'preview',
			slug: 'satisfaction',
			label: getLabelFromValue(
				'satisfaction',
				record.get(field_names.indicators.satisfaction)
			),
			color: getColorFromLabel(
				'satisfaction',
				getLabelFromValue(
					'satisfaction',
					record.get(field_names.indicators.satisfaction)
				)
			),
			value: isNaN(parseInt(record.get(field_names.indicators.satisfaction)))
				? null
				: record.get(field_names.indicators.satisfaction),
			procedureId: 'preview',
			noBackground: false
		},
		{
			id: 'preview',
			slug: 'simplicity',
			label: getLabelFromValue(
				'simplicity',
				record.get(field_names.indicators.simplicity)
			),
			color: getColorFromLabel(
				'simplicity',
				getLabelFromValue(
					'simplicity',
					record.get(field_names.indicators.simplicity)
				)
			),
			value: null,
			procedureId: 'preview',
			noBackground: false
		},
		{
			id: 'preview',
			slug: 'uptime',
			label: getLabelFromValue(
				'uptime',
				record.get(field_names.indicators.uptime)
			),
			color: getColorFromLabel(
				'uptime',
				getLabelFromValue('uptime', record.get(field_names.indicators.uptime))
			),
			value: null,
			procedureId: 'preview',
			noBackground: false
		}
	];

	const volume = parseInt(record.get(field_names.volume));
	return {
		id: 'preview',
		title: record.get(field_names.title),
		ministere: record.get(field_names.ministere),
		administration: record.get(field_names.administration),
		sousorg: record.get(field_names.sousorg),
		airtable_identifier: record.get(field_names.id),
		volume: isNaN(volume) ? null : volume,
		editionId: null,
		fields
	};
};

const getDemarches = async (_req: NextApiRequest, res: NextApiResponse) => {
	try {
		let procedures: ProcedureWithFields[] = [];
		await table
			.select({
				filterByFormula: `{${field_names.edition}} = 'Édition actuelle'`
			})
			.eachPage((records: any[], fetchNextPage: () => void) => {
				records.forEach(record => {
					procedures.push(recordToProcedure(record));
				});
				fetchNextPage();
			});
		res.status(200).json({ data: procedures });
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Something went wrong! 😕' });
	}
};

export default getDemarches;
