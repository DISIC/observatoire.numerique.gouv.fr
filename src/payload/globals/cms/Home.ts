import { standardFields } from '@/payload/fields/standards';
import { GlobalConfig } from 'payload';

standardFields.title;
export const CMSHome: GlobalConfig = {
	slug: 'home',
	label: 'CMS - Accueil',
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					label: 'En-tête',
					name: 'header',
					fields: [
						standardFields.title,
						standardFields.description,
						standardFields.button
					]
				},
				{
					label: 'Qualimétrie',
					name: 'quality',
					fields: [
						standardFields.title,
						standardFields.description,
						{
							name: 'blocs',
							label: 'Blocs',
							admin: {
								initCollapsed: true
							},
							type: 'array',
							required: true,
							fields: [
								standardFields.image,
								standardFields.title,
								standardFields.description,
								standardFields.button
							]
						}
					]
				},
				{
					label: 'Indicateurs',
					name: 'procedureHeaders',
					fields: [
						standardFields.title,
						standardFields.description,
						standardFields.button
					]
				},
				{
					label: 'Redirections',
					name: 'redirections',
					fields: [
						{
							name: 'textsWithImages',
							type: 'array',
							required: true,
							fields: [
								standardFields.image,
								standardFields.title,
								standardFields.description,
								standardFields.button,
							]
						}
					]
				}
			]
		}
	]
};
