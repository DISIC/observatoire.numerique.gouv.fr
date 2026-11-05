import { GlobalConfig } from 'payload';
import { globalCacheInvalidationHooks } from '../../hooks/invalidate-server-cache';

export const CMSFooter: GlobalConfig = {
	slug: 'footer',
	hooks: globalCacheInvalidationHooks(),
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
		}
	]
};
