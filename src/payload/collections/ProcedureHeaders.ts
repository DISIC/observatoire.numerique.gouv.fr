import {
	HTMLConverterFeature,
	lexicalEditor,
	lexicalHTML
} from '@payloadcms/richtext-lexical';
import type { CollectionConfig } from 'payload';

export const ProcedureHeaders: CollectionConfig = {
	slug: 'payload-procedure-headers',
	defaultPopulate: {
		icon: true,
		label: true,
		slug: true,
		description: true,
		levels: true
	},
	labels: {
		singular: 'Indicateur',
		plural: 'Indicateurs'
	},
	admin: {
		useAsTitle: 'label',
		defaultColumns: ['label', 'slug', 'position']
	},
	access: {
		read: () => true
	},
	fields: [
		{
			name: 'slug',
			type: 'text',
			required: true,
			unique: true
		},
		{
			name: 'label',
			type: 'text',
			required: true,
			label: 'Libellé'
		},
		{
			name: 'description_obj',
			type: 'richText',
			label: 'Description',
			editor: lexicalEditor({
				features: ({ defaultFeatures }) => [
					...defaultFeatures,
					HTMLConverterFeature({})
				]
			})
		},
		lexicalHTML('description_obj', { name: 'description_html' }),
		{
			name: 'icon',
			type: 'select',
			required: true,
			options: [
				{ label: 'Emotion Happy', value: 'ri-emotion-happy-line' },
				{ label: 'Computer', value: 'ri-computer-line' },
				{ label: 'Direction', value: 'ri-direction-line' },
				{ label: 'Rest Time', value: 'ri-rest-time-line' },
				{ label: 'Customer Service', value: 'ri-customer-service-2-line' },
				{ label: 'Shield User', value: 'ri-shield-user-line' },
				{ label: 'Timer Flash', value: 'ri-timer-flash-line' },
				{ label: 'Spam', value: 'ri-spam-line' },
				{ label: 'Open Arm', value: 'ri-open-arm-line' },
				{ label: 'Sun', value: 'ri-sun-line' },
				{ label: 'Chat Smile', value: 'ri-chat-smile-line' }
			]
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
			name: 'moreInfosTitle',
			type: 'text',
			label: 'Titre des informations supplémentaires'
		},
		{
			name: 'moreInfos',
			type: 'textarea',
			label: 'Informations supplémentaires'
		},
		{
			name: 'levels',
			label: "Niveaux d'évaluation",
			type: 'join',
			collection: 'payload-indicator-levels',
			on: 'procedureHeader',
			hasMany: true
		}
	],
	timestamps: true
};

export default ProcedureHeaders;
