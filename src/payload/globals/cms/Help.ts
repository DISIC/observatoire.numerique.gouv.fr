import { standardFields } from '@/payload/fields/standards';
import { lexicalHTML } from '@payloadcms/richtext-lexical';
import { GlobalConfig } from 'payload';
import { globalCacheInvalidationHooks } from '../../hooks/invalidate-server-cache';

export const CMSHelp: GlobalConfig = {
	slug: 'help',
	hooks: globalCacheInvalidationHooks(),
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
						lexicalHTML('wysiwyg', { name: 'wysiwyg_html' })
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
									// Nom de table PostgreSQL limité à 63 caractères
									dbName: 'help_key_indicators_list',
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
									// Colonne tronquée à 63 caractères par PostgreSQL (sans collision), dbName non supporté ici
									name: 'additionnalIndicatorsDescription',
									label: 'Description des indicateurs complémentaires',
									type: 'textarea'
								},
								{
									type: 'array',
									name: 'additionnalIndicatorsList',
									dbName: 'help_additionnal_indicators_list',
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
