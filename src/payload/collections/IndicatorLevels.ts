import type { CollectionConfig } from 'payload';

export const IndicatorLevels: CollectionConfig = {
	slug: 'payload-indicator-levels',
	defaultPopulate: {
		label: true,
		color: true,
		description: true,
		position: true,
		noBackround: true
	},
	labels: {
		singular: "Niveau d'indicateur",
		plural: 'Niveaux des indicateurs'
	},
	admin: {
		useAsTitle: 'label',
		defaultColumns: ['label', 'color', 'description', 'position']
	},
	access: {
		read: () => true
	},
	fields: [
		{
			name: 'label',
			type: 'text',
			required: true,
			label: 'Libellé'
		},
		{
			name: 'color',
			type: 'select',
			required: true,
			defaultValue: 'gray',
			options: [
				{ label: 'Vert', value: 'green' },
				{ label: 'Jaune', value: 'yellow' },
				{ label: 'Rouge', value: 'red' },
				{ label: 'Bleu', value: 'blue' },
				{ label: 'Gris', value: 'gray' },
				{ label: 'Orange', value: 'orange' }
			]
		},
		{
			name: 'description',
			type: 'textarea',
			label: 'Description',
			required: true
		},
		{
			name: 'procedureHeader',
			type: 'relationship',
			relationTo: 'payload-procedure-headers',
			label: 'Indicateur associé',
			required: true
		},
		{
			name: 'position',
			type: 'number',
			required: true,
			admin: {
				step: 1
			}
		},
		{
			name: 'noBackround',
			type: 'checkbox',
			label: "Pas d'arrière-plan"
		}
	],
	timestamps: true
};

export default IndicatorLevels;
