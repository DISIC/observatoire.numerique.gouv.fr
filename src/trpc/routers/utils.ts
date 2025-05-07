import { ProcedureWithFields } from "@/pages/api/procedures/types";
import { PayloadIndicator, PayloadIndicatorLevel } from "@/payload/payload-types";
import { IndicatorColor } from "@prisma/client";

export const grist_field_names = {
	edition: 'Ref_Edition',
	id: 'Ref_Demarche',
	link: 'URL_Demarche',
	title: 'Nom_Demarche',
	administration: 'Nom_Administration',
	sousorg: 'Nom_Administration_Centrale',
	ministere: 'Nom_Ministere',
	volume: 'Volumetrie_En_Ligne',
	noJdma: 'Ajout_Bouton_JDMA',
	indicators: {
		online: 'Statut_En_ligne',
		satisfaction: 'Note_Satisfaction',
		simplicity: 'Note_Clarte_Langage',
		help_reachable: 'Aide_Joignable',
		help_efficient: 'Aide_Efficace',
		help_used: 'Niveau_Autonomie',
		uptime: 'Dashlord_UpDown_Dispo',
		performance: 'Dashlord_UpDown_Tps_Moy_Chargement',
		handicap: 'Libelle_RGAA',
		dlnuf: 'DLNUF_pour_publication_',
		usage: 'Recours_au_Numerique',
		auth: 'FranceConnect'
	}
};

const grist_field_names_percentages = [
	grist_field_names.indicators.usage,
	grist_field_names.indicators.handicap,
	grist_field_names.indicators.uptime,
	grist_field_names.indicators.help_used,
	grist_field_names.indicators.help_reachable
]

export type GristFields = typeof grist_field_names;

export const getFieldsFromGristProcedure = (
	gristProcedure: any,
	indicators: PayloadIndicator[]
): ProcedureWithFields['fields'] => {
	return indicators.map(indicator => {
		const indicatorLevels = ((indicator.levels?.docs || []) as PayloadIndicatorLevel[]);
		const gristColumnName = grist_field_names.indicators[indicator.slug as keyof GristFields['indicators']]
		let value = gristProcedure[gristColumnName]

		if (value === null) {
			return {
				id: `preview-${indicator.id}`,
				slug: indicator.slug,
				label: '-',
				value: null,
				color: 'gray' as IndicatorColor,
				noBackground: true,
				procedureId: 'preview'
			}
		}

		if (grist_field_names_percentages.includes(gristColumnName) && !isNaN(value)) {
			value = (value * 100).toFixed(1).replace(/\.0$/, '');
		}

		if (!isNaN(value)) {
			const indicatorLevel = indicatorLevels.filter(
				(level) => level.threshold !== undefined && level.threshold !== null
			).sort(
				(a, b) => (b.threshold ?? 10000) - (a.threshold ?? 10000)
			).find(
				(level) => (level.threshold ?? 10000) <= value
			);

			if (indicatorLevel) {
				return {
					id: `preview-${indicator.id}`,
					slug: indicator.slug,
					label: indicatorLevel.label.replace(/X{1,5}/g, value),
					value: value !== null ? value.toString() : value,
					color: indicatorLevel.color,
					noBackground: indicatorLevel.noBackground || false,
					procedureId: 'preview'
				}
			}
		}

		const indicatorLevel = indicatorLevels.find((level: PayloadIndicatorLevel) => level.label === value);
		if (indicatorLevel && typeof indicatorLevel !== 'string') {
			return {
				id: `preview-${indicator.id}`,
				slug: indicator.slug,
				label: value,
				value: indicator.slug === 'online' ? gristProcedure[grist_field_names.link] : value ? value.toString() : value,
				color: indicatorLevel.color,
				noBackground: indicatorLevel.noBackground || false,
				procedureId: 'preview'
			}
		}

		return null;

	}).filter((field) => field !== null);
}