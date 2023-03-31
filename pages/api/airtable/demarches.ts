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
	sousorg: 'Ministère opérationnel',
	ministere: 'Ministère politique',
	volume: 'Volumétrie totale',
	indicators: {
		online: '📊  En ligne',
		satisfaction: '📊 Note de satisfaction /10',
		simplicity: '[Dashlord] - JDMA note facilité',
		uptime: '📊  Disponibilité et rapidité',
		handicap:
			'📊  Prise en compte handicaps (après prise en compte taux global)',
		dlnuf: '📊  Dites-le nous une fois sans carrés',
		usage: '🕶 Volumétrie en ligne',
		auth: '📊  FranceConnect'
	}
};
const getLabelFromValue = (slug: IndicatorSlug, value: string): string => {
	switch (slug) {
		case 'online':
			return ['Oui', 'Non', 'Partiel', 'Bêta'].includes(value) ? value : 'Non';
		case 'satisfaction':
			const satisfactionIntValue = parseInt(value);
			if (isNaN(satisfactionIntValue)) return "Nombre d'avis insuffisant";
			if (satisfactionIntValue < 5) return 'Mauvaise';
			if (satisfactionIntValue < 8) return 'Moyenne';
			return 'Très bonne';

		case 'simplicity':
			const simplicityIntValue = parseInt(value);
			if (isNaN(simplicityIntValue)) return "Nombre d'avis insuffisant";
			if (simplicityIntValue < 4) return 'Mauvaise';
			if (simplicityIntValue < 6) return 'Moyenne';
			if (simplicityIntValue < 8) return 'Bonne';
			return 'Très bonne';
		case 'uptime':
			const uptimeIntValue = parseInt(value);
			if (isNaN(uptimeIntValue)) return 'Indéterminée';
			if (uptimeIntValue < 4) return 'Mauvaise';
			if (uptimeIntValue < 6) return 'Moyenne';
			if (uptimeIntValue < 8) return 'Bonne';
			return 'Très bonne';
		case 'dlnuf':
			const dlnufIntValue = parseInt(value);
			if (isNaN(dlnufIntValue)) return 'Non communiqué';
			if (dlnufIntValue < 4) return 'Mauvais';
			if (dlnufIntValue < 6) return 'Moyen';
			if (dlnufIntValue < 8) return 'Bon';
			return 'Très bon';
		case 'handicap':
			const realValue = value.split(' ')[1];
			if (['Oui', 'Non'].includes(realValue)) return realValue;
			if (realValue === 'Partiel') return 'Partielle';
			return 'Indéterminée';
		case 'usage':
			const usageFloatValue = parseFloat(value);
			if (isNaN(usageFloatValue)) return 'Indéterminée';
			if (usageFloatValue < 0.3) return 'Faible';
			if (usageFloatValue < 0.5) return 'Moyenne';
			if (usageFloatValue < 0.8) return 'Élevée';
			return 'Totale';
		case 'auth':
			if (value === 'Oui') return 'FranceConnect';
			if (value === 'Non') return 'Spécifique';
			return 'Indéterminée';
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
			if (label === "Nombre d'avis insuffisant") return 'gray';
			if (label === 'Moyenne') return 'orange';
			if (label === 'Mauvaise') return 'red';
			else return 'green';
		case 'simplicity':
			if (label === "Nombre d'avis insuffisant") return 'gray';
			if (label === 'Bonne') return 'yellow';
			if (label === 'Moyenne') return 'orange';
			if (label === 'Mauvaise') return 'red';
		case 'uptime':
			if (label === 'Indéterminée') return 'gray';
			if (label === 'Bonne') return 'yellow';
			if (label === 'Moyenne') return 'orange';
			if (label === 'Mauvaise') return 'red';
			else return 'green';
		case 'dlnuf':
			if (label === 'Non communiqué') return 'gray';
			if (label === 'Bon') return 'yellow';
			if (label === 'Moyen') return 'orange';
			if (label === 'Mauvais') return 'red';
			else return 'green';
		case 'handicap':
			if (label === 'Oui') return 'green';
			if (label === 'Partielle') return 'orange';
			if (label === 'Non') return 'red';
			else return 'gray';
		case 'usage':
			return 'gray';
		case 'auth':
			if (label === 'FranceConnect') return 'blue';
			if (label === 'Spécifique') return 'yellow';
			return 'gray';
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
			noBackground:
				getLabelFromValue(
					'satisfaction',
					record.get(field_names.indicators.satisfaction)
				) === "Nombre d'avis insuffisant"
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
			noBackground:
				getLabelFromValue(
					'simplicity',
					record.get(field_names.indicators.simplicity)
				) === "Nombre d'avis insuffisant"
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
		},
		{
			id: 'preview',
			slug: 'handicap',
			label: getLabelFromValue(
				'handicap',
				record.get(field_names.indicators.handicap)
			),
			color: getColorFromLabel(
				'handicap',
				getLabelFromValue(
					'handicap',
					record.get(field_names.indicators.handicap)
				)
			),
			value: null,
			procedureId: 'preview',
			noBackground: false
		},
		{
			id: 'preview',
			slug: 'dlnuf',
			label: getLabelFromValue(
				'dlnuf',
				record.get(field_names.indicators.dlnuf)
			),
			color: getColorFromLabel(
				'dlnuf',
				getLabelFromValue('dlnuf', record.get(field_names.indicators.dlnuf))
			),
			value: null,
			procedureId: 'preview',
			noBackground:
				getLabelFromValue('dlnuf', record.get(field_names.indicators.dlnuf)) ===
				'Non communiqué'
		},
		{
			id: 'preview',
			slug: 'usage',
			label: getLabelFromValue(
				'usage',
				(
					parseInt(record.get(field_names.indicators.usage)) /
					parseInt(record.get(field_names.volume))
				).toString()
			),
			color: getColorFromLabel(
				'usage',
				getLabelFromValue(
					'usage',
					(
						parseInt(record.get(field_names.indicators.usage)) /
						parseInt(record.get(field_names.volume))
					).toString()
				)
			),
			value: null,
			procedureId: 'preview',
			noBackground: null
		},
		{
			id: 'preview',
			slug: 'help_reachable',
			label: 'Bientôt disponible',
			color: 'gray',
			value: null,
			procedureId: 'preview',
			noBackground: true
		},
		{
			id: 'preview',
			slug: 'help_used',
			label: 'Bientôt disponible',
			color: 'gray',
			value: null,
			procedureId: 'preview',
			noBackground: true
		},
		{
			id: 'preview',
			slug: 'performance',
			label: 'À faire',
			color: 'orange',
			value: null,
			procedureId: 'preview',
			noBackground: null
		},
		{
			id: 'preview',
			slug: 'auth',
			label: getLabelFromValue('auth', record.get(field_names.indicators.auth)),
			color: getColorFromLabel(
				'auth',
				getLabelFromValue('auth', record.get(field_names.indicators.auth))
			),
			value: null,
			procedureId: 'preview',
			noBackground: null
		}
	];

	const volume = parseInt(record.get(field_names.volume));
	return {
		id: 'preview',
		title: record.get(field_names.title).replace(/[^\w\sÀ-ÿ]/gi, ''),
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
		res.status(200).json({
			data: procedures.sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0))
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Something went wrong! 😕' });
	}
};

export default getDemarches;
