import { GlobalConfig } from "payload";

export const CMSHome: GlobalConfig = {
	slug: "home",
	label: "CMS - Accueil",
	fields: [
		{
			name: "heading",
			label: "Titre de la page",
			type: 'text'
		},
	],
};