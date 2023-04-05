import { NextApiRequest, NextApiResponse } from 'next';
import { table } from '../../../utils/airtable';
import { ProcedureWithFields } from '../procedures/types';
import { Field, IndicatorColor, IndicatorSlug } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

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
		satisfaction: '[Dashlord] - JDMA note satisfaction',
		simplicity: '[Dashlord] - JDMA note facilité',
		uptime: '🕶Taux de disponibilité',
		performance: '🕶Temps de réponse (milliseconde)',
		handicap: 'Taux global RGAA',
		dlnuf: '📊  Dites-le nous une fois sans carrés',
		usage: '🕶 Volumétrie en ligne',
		auth: '📊  FranceConnect'
	}
};
const getLabelFromValue = (slug: IndicatorSlug, value: string): string => {
	switch (slug) {
		case 'online':
			if (['Oui', 'Non', 'Partiel', 'Bêta'].includes(value)) return value;
			if (value === 'En cours de déploiement local') return 'En cours';
			return 'Non';
		case 'satisfaction':
			const satisfactionIntValue = parseInt(value);
			if (isNaN(satisfactionIntValue)) {
				if (value === 'Nombre insuffisant d’avis')
					return "Nombre d'avis insuffisant";
				if (value === 'En attente') return 'En attente';
			}
			if (satisfactionIntValue < 5) return 'Mauvaise';
			if (satisfactionIntValue < 8) return 'Moyenne';
			return 'Très bonne';
		case 'simplicity':
			const simplicityIntValue = parseInt(value);
			if (isNaN(simplicityIntValue)) return "Nombre d'avis insuffisant";
			if (simplicityIntValue < 5) return 'Mauvaise';
			if (simplicityIntValue < 8) return 'Moyenne';
			return 'Très bonne';
		case 'uptime':
			const uptimeIntValue = parseFloat(value);
			if (isNaN(uptimeIntValue)) return 'En attente';
			if (uptimeIntValue < 0.985) return 'Mauvaise';
			if (uptimeIntValue < 0.99) return 'Moyenne';
			return 'Très bonne';
		case 'performance':
			const performanceIntValue = parseInt(value);
			if (isNaN(performanceIntValue)) return 'En attente';
			if (performanceIntValue > 800) return 'Lent';
			if (performanceIntValue > 400) return 'Moyen';
			return 'Très rapide';
		case 'dlnuf':
			const dlnufIntValue = parseInt(value);
			if (isNaN(dlnufIntValue)) return 'Non communiqué';
			if (dlnufIntValue < 4) return 'Mauvais';
			if (dlnufIntValue < 6) return 'Moyen';
			if (dlnufIntValue < 8) return 'Bon';
			return 'Très bon';
		case 'handicap':
			const handicapIntValue = parseFloat(value);
			if (isNaN(handicapIntValue)) return 'Indéterminée';
			if (handicapIntValue < 0.5) return 'Non';
			if (handicapIntValue < 1) return 'Partielle';
			return 'Oui';
		case 'usage':
			const usageFloatValue = parseFloat(value);
			if (isNaN(usageFloatValue)) return 'En attente';
			if (usageFloatValue < 0.4) return 'Faible';
			if (usageFloatValue < 0.75) return 'Moyenne';
			if (usageFloatValue < 1) return 'Élevée';
			return 'Totale';
		case 'auth':
			if (['FranceConnect', 'FranceConnect +', 'Non'].includes(value))
				return value;
			return 'En attente';
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
			else if (label === 'En cours') return 'blue';
			else return 'red';
		case 'satisfaction':
			if (label === "Nombre d'avis insuffisant") return 'gray';
			if (label === 'En attente') return 'blue';
			if (label === 'Moyenne') return 'orange';
			if (label === 'Mauvaise') return 'red';
			else return 'green';
		case 'simplicity':
			if (label === "Nombre d'avis insuffisant") return 'gray';
			if (label === 'Moyenne') return 'orange';
			if (label === 'Mauvaise') return 'red';
		case 'uptime':
			if (label === 'En attente') return 'gray';
			if (label === 'Moyenne') return 'orange';
			if (label === 'Mauvaise') return 'red';
			else return 'green';
		case 'performance':
			if (label === 'En attente') return 'gray';
			if (label === 'Moyen') return 'orange';
			if (label === 'Lent') return 'red';
			else return 'green';
		case 'dlnuf':
			if (label === 'Non communiqué') return 'gray';
			if (label === 'Bon') return 'yellow';
			if (label === 'Moyen') return 'orange';
			if (label === 'Mauvais') return 'red';
			else return 'green';
		case 'handicap':
			if (label === 'Oui') return 'green';
			if (label === 'Partielle') return 'yellow';
			if (label === 'Non') return 'red';
			else return 'gray';
		case 'usage':
			return 'gray';
		case 'auth':
			if (label === 'En attente') return 'gray';
			if (label === 'Non') return 'red';
			return 'blue';
		default:
			return 'gray';
	}
};

const getRoundedDecimalString = (value: string): string | null => {
	if (isNaN(parseInt(value))) return null;
	return (Math.round(parseFloat(value) * 10) / 10).toString();
};

const recordToProcedure = (record: any): ProcedureWithFields => {
	console.log(record);
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
			value: getRoundedDecimalString(
				record.get(field_names.indicators.satisfaction)
			),
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
			value: getRoundedDecimalString(
				record.get(field_names.indicators.simplicity)
			),
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
			value: getRoundedDecimalString(
				(record.get(field_names.indicators.uptime) * 100).toString()
			),
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
			value: getRoundedDecimalString(
				(record.get(field_names.indicators.handicap) * 100).toString()
			),
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
			label: getLabelFromValue(
				'performance',
				record.get(field_names.indicators.performance)
			),
			color: getColorFromLabel(
				'performance',
				getLabelFromValue(
					'performance',
					record.get(field_names.indicators.performance)
				)
			),
			value: record.get(field_names.indicators.performance),
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
	const token = await getToken({
		req: _req,
		secret: process.env.JWT_SECRET
	});
	if (!token || (token.exp as number) > new Date().getTime())
		return res.status(401).json({ msg: 'You shall not pass.' });

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
