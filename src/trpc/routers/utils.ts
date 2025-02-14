import { ProcedureWithFields } from "@/pages/api/procedures/types";
import { PayloadIndicator, PayloadIndicatorLevel } from "@/payload/payload-types";

export const grist_field_names = {
	edition: 'Lien_Vers_Statistiques_Edition_AT_',
	id: 'id',
	link: 'URL_Demarche',
	title: 'Nom_demarche_AT_',
	administration: 'Administration_AT_',
	sousorg: 'Min_politique_AT_',
	ministere: 'Min_politique_AT_',
	volume: 'Volumetrie_Totale',
	noJdma: 'MaJ_Manuelle_Satisfaction',
	indicators: {
		online: 'Statut_En_ligne',
		satisfaction: 'Note_Satisfaction',
		simplicity: 'Note_Clarte_Langage',
		help_reachable: 'Aide_Joignable',
		help_efficient: 'Aide_Efficace',
		help_used: 'Niveau_d_Autonomie',
		uptime: 'Dashlord_UpDown_disponibilite',
		performance: 'Dashlord_UpDown_temps_de_reponse',
		handicap: 'Prise_En_Compte_Handicap',
		dlnuf: 'DLNUF_pour_publication_',
		usage: 'Tx_Recours_Demat',
		auth: 'FranceConnect'
	}
};

export type GristFields = typeof grist_field_names;

export const getFieldsFromGristProcedure = (
	gristProcedure: any,
	indicators: PayloadIndicator[]
): ProcedureWithFields['fields'] => {
	return indicators.map(indicator => {
		const indicatorLevels = ((indicator.levels?.docs || []) as PayloadIndicatorLevel[]);
		const value = gristProcedure[grist_field_names.indicators[indicator.slug as keyof GristFields['indicators']]]

		if (!isNaN(value)) {
			const indicatorLevel = indicatorLevels.filter(
				(level) => level.threshold !== undefined && level.threshold !== null
			).sort((a, b) => (b.threshold ?? 10000) - (a.threshold ?? 10000)).find((level) => (level.threshold ?? 10000) <= value);

			if (indicatorLevel) {
				return {
					id: `preview-${indicator.id}`,
					slug: indicator.slug,
					label: indicatorLevel.label.replace(/X{1,5}/g, value),
					value,
					color: indicatorLevel.color,
					noBackground: indicatorLevel.noBackground || null,
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
				value,
				color: indicatorLevel.color,
				noBackground: indicatorLevel.noBackground || null,
				procedureId: 'preview'
			}
		}

		return null;

	}).filter((field) => field !== null);
}