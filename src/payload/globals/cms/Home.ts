import { GlobalConfig } from "payload";

export const CMSHome: GlobalConfig = {
	slug: "home",
	label: "CMS - Accueil",
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					label: 'En-tête',
					name: 'header',
					fields: [
						{
							name: "title",
							label: "Titre",
							type: 'text',
							required: true,
						},
						{
							name: "description",
							label: "Description",
							type: 'textarea',
							required: true,
						},
						{
							name: "button",
							label: "Bouton",
							type: 'text',
							required: true,
						},
					],
				},
				{
					label: 'Qualimétrie',
					name: 'quality',
					fields: [
						{
							name: "title",
							label: "Titre",
							type: 'text',
							required: true,
						},
						{
							name: "description",
							label: "Description",
							type: 'textarea',
							required: true,
						},
					]
				}
			]
		},
	],
};