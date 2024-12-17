import { standardFields } from '@/payload/fields/standards';
import { lexicalHTML } from '@payloadcms/richtext-lexical';
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
					fields: [standardFields.title]
				},
				{
					label: 'Objectifs et méthodologie',
					name: 'goals',
					fields: [
						standardFields.title,
						standardFields.wysiwyg,
						lexicalHTML('wysiwyg', { name: 'wysiwyg_html' })
					]
				},
				{
					label: "Critères d'entrée des services",
					name: 'criterias',
					fields: [
						standardFields.title,
						standardFields.wysiwyg,
						lexicalHTML('wysiwyg', { name: 'wysiwyg_html' }),
						standardFields.button
					]
				},
				{
					label: 'Indicateurs de qualité',
					name: 'indicators',
					fields: [
						standardFields.title,
						{
							type: 'group',
							name: 'keyIndicators',
							label: 'Indicateurs Clés',
							fields: [
								{
									name: 'keyIndicatorsTitle',
									label: 'Titre des indicateurs clés',
									type: 'text',
									required: true
								},
								{
									name: 'keyIndicatorsDescription',
									label: 'Description des indicateurs clés',
									type: 'textarea'
								},
								{
									type: 'array',
									name: 'keyIndicatorsList',
									label: 'Liste des indicateurs clés',
									labels: {
										singular: 'Indicateur',
										plural: 'Indicateurs'
									},
									admin: {
										initCollapsed: true
									},
									fields: [
										{
											name: 'indicator',
											type: 'relationship',
											relationTo: 'payload-indicators',
											required: true
										}
									]
								}
							]
						},
						{
							type: 'group',
							name: 'additionnalIndicators',
							label: 'Indicateurs Complémentaires',
							fields: [
								{
									name: 'additionnalIndicatorsTitle',
									label: 'Titre des indicateurs complémentaires',
									type: 'text',
									required: true
								},
								{
									name: 'additionnalIndicatorsDescription',
									label: 'Description des indicateurs complémentaires',
									type: 'textarea'
								},
								{
									type: 'array',
									name: 'additionnalIndicatorsList',
									label: 'Liste des indicateurs complémentaires',
									labels: {
										singular: 'Indicateur',
										plural: 'Indicateurs'
									},
									admin: {
										initCollapsed: true
									},
									fields: [
										{
											name: 'indicator',
											type: 'relationship',
											relationTo: 'payload-indicators',
											required: true
										}
									]
								}
							]
						}
					]
				}
			]
		}
	]
};
function useRowLabel<T>(): { data: any; rowNumber: any } {
	throw new Error('Function not implemented.');
}
