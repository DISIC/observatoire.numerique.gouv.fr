import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
	slug: 'payload-media',
	labels: {
		singular: 'Media',
		plural: 'Medias'
	},
	access: {
		read: () => true,
	},
	fields: [
		{
			name: 'alt',
			type: 'text',
			required: true,
		},
	],
	upload: true,
}
