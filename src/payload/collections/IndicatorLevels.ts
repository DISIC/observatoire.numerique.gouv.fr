import type { CollectionConfig } from 'payload';

export const IndicatorLevels: CollectionConfig = {
	slug: 'payload-indicator-levels',
	defaultPopulate: {
		label: true,
		label_stats: true,
		color: true,
		description: true,
		position: true,
		noBackground: true,
		threshold: true,
		goal_reached: true
	},
	labels: {
		singular: "Niveau d'indicateur",
		plural: 'Niveaux des indicateurs'
	},
	admin: {
		hidden: true,
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
			name: 'label_stats',
			type: 'text',
			label: 'Libellé statistique'
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
			name: 'indicator',
			type: 'relationship',
			relationTo: 'payload-indicators',
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
			name: 'threshold',
			type: 'number',
			label: 'Seuil (à partir de)'
		},
		{
			name: 'noBackground',
			type: 'checkbox',
			label: "Pas d'arrière-plan"
		},
		{
			name: 'goal_reached',
			type: 'checkbox',
			label: 'Objectif atteint'
		}
	],
	timestamps: true
};

export default IndicatorLevels;
