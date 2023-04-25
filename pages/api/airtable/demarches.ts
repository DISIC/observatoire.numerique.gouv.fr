import { NextApiRequest, NextApiResponse } from 'next';
import { table } from '../../../utils/airtable';
import { ProcedureWithFields } from '../procedures/types';
import { Field } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import {
	getColorFromLabel,
	getLabelFromValue,
	getRoundedDecimalString
} from './utils';

const field_names = {
	edition: 'Lien vers statistiques édition',
	id: 'ID',
	link: 'Lien',
	title: 'Nom de la démarche / projet',
	administration: 'Administration',
	sousorg: 'Ministère politique',
	ministere: 'Ministère politique',
	volume: 'Volumétrie totale',
	indicators: {
		online: '📊 En ligne',
		satisfaction: '📊 Satisfaction',
		simplicity: '2️⃣ Complexité du langage',
		uptime: '2️⃣ Taux de disponibilité',
		performance: '2️⃣ Temps moyen de chargement',
		handicap: '📊 Prise en compte du handicap',
		dlnuf: '🧜‍♀️ Note DLNUF',
		usage: 'Volumétrie en ligne',
		auth: '2️⃣ FranceConnect'
	}
};

const recordToProcedure = (record: any): ProcedureWithFields => {
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
			value: (
				parseInt(record.get(field_names.indicators.usage)) /
				parseInt(record.get(field_names.volume))
			).toString(),
			procedureId: 'preview',
			noBackground: null
		},
		{
			id: 'preview',
			slug: 'help_reachable',
			label: 'À venir',
			color: 'gray',
			value: null,
			procedureId: 'preview',
			noBackground: true
		},
		{
			id: 'preview',
			slug: 'help_used',
			label: 'À venir',
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
			value: parseInt(
				record.get(field_names.indicators.performance)
			).toString(),
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
		id: `preview-${record.get(field_names.id)}`,
		title: record
			.get(field_names.title)
			.replace(
				/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
				''
			)
			.trim(),
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
