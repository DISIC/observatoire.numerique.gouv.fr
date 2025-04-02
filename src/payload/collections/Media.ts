import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
	slug: 'payload-media',
	defaultPopulate: {
		url: true,
		filename: true,
		width: true,
		height: true,
		alt: true
	},
	labels: {
		singular: 'Media',
		plural: 'Medias'
	},
	admin: {
		hidden: true
	},
	access: {
		read: () => true
	},
	fields: [
		{
			name: 'alt',
			type: 'text',
			required: true
		}
	],
	upload: true
};
