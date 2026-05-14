import type { CollectionConfig } from 'payload';

export const Versions: CollectionConfig = {
	slug: 'payload-versions',
	labels: {
		singular: 'Version',
		plural: 'Versions'
	},
	admin: {
		useAsTitle: 'name',
		defaultColumns: ['name', 'number', 'description']
	},
	defaultSort: 'number',
	access: {
		read: () => true
	},
	fields: [
		{
			name: 'name',
			type: 'text',
			required: true,
			label: 'Nom'
		},
		{
			name: 'number',
			type: 'number',
			required: true,
			unique: true,
			label: 'Numéro de version',
			admin: {
				step: 1
			}
		},
		{
			name: 'description',
			type: 'textarea',
			label: 'Description (raison de cette nouvelle version)'
		}
	],
	timestamps: true
};

export default Versions;
