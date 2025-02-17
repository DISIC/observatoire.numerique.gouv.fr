import { GlobalConfig } from 'payload';

export const CMSFooter: GlobalConfig = {
	slug: 'footer',
	label: 'CMS - Footer',
	access: {
		read: () => true
	},
	fields: [
		{
			name: 'description',
			label: 'Description du site',
			type: 'text',
			required: true
		},
	]
};
