import { standardFields } from '@/payload/fields/standards';
import { GlobalConfig } from 'payload';

standardFields.title;
export const CMSHelp: GlobalConfig = {
	slug: 'help',
	label: 'CMS - Aide Observatoire',
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					label: 'En-tête',
					name: 'header',
					fields: [
						standardFields.title,
					]
				},
				{
					label: 'Objectifs et méthodologie',
					name: 'goals',
					fields: [
						standardFields.title,
						standardFields.wysiwyg
					]
				},
				{
					label: 'Critères d\'entrée des services',
					name: 'criterias',
					fields: [
						standardFields.title,
						standardFields.wysiwyg,
						standardFields.button
					]
				},
				{
					label: 'Indicateurs de qualité',
					name: 'indicators',
					fields: [
						standardFields.title,
						{
							type:'group',
							name: 'keyIndicators',
							label: 'Indicateurs Clés',
							fields:[
								{
									name:'keyIndicatorsTitle',
									label: 'Titre des indicateurs clés',
									type: 'text',
									required: true
								},
								{
									name: 'keyIndicatorsDescription',
									label: 'Description des indicateurs clés',
									type: 'textarea',
								},
								{
									type: 'array',
									name: 'keyIndicatorsList',
									label: 'Liste des indicateurs clés',
									admin: {
										initCollapsed: true
									},
									fields: [
										{
											name: 'indicator',
											type: 'relationship',
											relationTo: 'payload-procedure-headers',
											required: true
										}
									]
								}
							]
						},
						{
							type:'group',
							name: 'additionnalIndicators',
							label: 'Indicateurs Complémentaires',
							fields:[
								{
									name:'additionnalIndicatorsTitle',
									label: 'Titre des indicateurs complémentaires',
									type: 'text',
									required: true
								},
								{
									name: 'additionnalIndicatorsDescription',
									label: 'Description des indicateurs complémentaires',
									type: 'textarea',
								},
								{
									type: 'array',
									name: 'additionnalIndicatorsList',
									label: 'Liste des indicateurs complémentaires',
									admin: {
										initCollapsed: true
									},
									fields: [
										{
											name: 'indicator',
											type: 'relationship',
											relationTo: 'payload-procedure-headers',
											required: true
										}
									]
								}
							]
						}
					]
				},
			]
		}
	]
};
