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
	noJdma: 'MAJ manuelle de la satisfaction',
	indicators: {
		online: '📊 En ligne',
		satisfaction: '📊 Satisfaction',
		simplicity: '2️⃣ Simplicité du langage',
		help_reachable: '[Dashlord] - JDMA aide note',
		help_used: '[Dashlord] - JDMA autonomie note',
		uptime: '2️⃣ Taux de disponibilité',
		performance: '2️⃣ Temps moyen de chargement',
		handicap: '📊 Prise en compte du handicap',
		dlnuf: 'DLNUF (pour publication)',
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
			noBackground:
				getLabelFromValue(
					'online',
					record.get(field_names.indicators.online)
				) === 'À venir'
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
			noBackground: ['À venir', "Nombre d'avis insuffisant"].includes(
				getLabelFromValue(
					'satisfaction',
					record.get(field_names.indicators.satisfaction)
				)
			)
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
			noBackground: ['À venir', "Nombre d'avis insuffisant"].includes(
				getLabelFromValue(
					'simplicity',
					record.get(field_names.indicators.simplicity)
				)
			)
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
			noBackground:
				getLabelFromValue(
					'uptime',
					record.get(field_names.indicators.uptime)
				) === 'À venir'
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
			noBackground:
				getLabelFromValue(
					'handicap',
					record.get(field_names.indicators.handicap)
				) === 'À venir'
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
				'À venir'
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
			noBackground:
				getLabelFromValue(
					'usage',
					(
						parseInt(record.get(field_names.indicators.usage)) /
						parseInt(record.get(field_names.volume))
					).toString()
				) === 'À venir'
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
			noBackground:
				getLabelFromValue(
					'performance',
					record.get(field_names.indicators.performance)
				) === 'À venir'
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
			noBackground:
				getLabelFromValue('auth', record.get(field_names.indicators.auth)) ===
				'À venir'
		}
	];

	const volume = parseInt(record.get(field_names.indicators.usage));
	const title = record
		.get(field_names.title)
		.replace(/(?:\uD83D\uDCC4|#)/g, '')
		.trim();

	return {
		id: `preview-${record.get(field_names.id)}`,
		title,
		title_normalized: title.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
		ministere: record.get(field_names.ministere),
		administration: record.get(field_names.administration),
		sousorg: record.get(field_names.sousorg),
		airtable_identifier: record.get(field_names.id),
		volume: isNaN(volume) ? null : volume,
		editionId: null,
		noJdma: record.get(field_names.noJdma) || false,
		fields
	};
};

const getDemarches = async (_req: NextApiRequest, res: NextApiResponse) => {
	const token = await getToken({
		cookieName: process.env.NEXTAUTH_COOKIENAME,
		req: _req,
		secret: process.env.JWT_SECRET
	});
	if (!token || (token.exp as number) > new Date().getTime())
		return res.status(401).json({ msg: 'You shall not pass.' });

	try {
		let procedures: ProcedureWithFields[] = [];
		const edition = _req.query.edition;
		if (!edition) throw Error;
		await table
			.select({
				filterByFormula: `{${field_names.edition}} = '${edition}'`
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
