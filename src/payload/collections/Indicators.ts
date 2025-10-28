import {
	HTMLConverterFeature,
	lexicalEditor,
	lexicalHTML
} from '@payloadcms/richtext-lexical';
import type { CollectionConfig } from 'payload';

enum IndicatorSlug {
	online = 'online',
	satisfaction = 'satisfaction',
	handicap = 'handicap',
	dlnuf = 'dlnuf',
	usage = 'usage',
	simplicity = 'simplicity',
	help_reachable = 'help_reachable',
	help_efficient = 'help_efficient',
	help_used = 'help_used',
	uptime = 'uptime',
	performance = 'performance',
	auth = 'auth'
}

export const Indicators: CollectionConfig = {
	slug: 'payload-indicators',
	defaultPopulate: {
		icon: true,
		label: true,
		slug: true,
		description_obj: true,
		description_html: true,
		moreInfos: true,
		moreInfosTitle: true,
		threshold_max: true,
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
	defaultSort: 'position',
	access: {
		read: () => true
	},
	fields: [
		{
			name: 'slug',
			type: 'select',
			required: true,
			options: Object.values(IndicatorSlug)
		},
		{
			name: 'label',
			type: 'text',
			required: true,
			label: 'Libellé'
		},
		{
			name: 'description',
			type: 'textarea',
			label: 'Description succincte'
		},
		{
			name: 'description_radar',
			type: 'textarea',
			label: 'Description des jauges du radar'
		},
		{
			name: 'description_obj',
			type: 'richText',
			label: 'Description complète',
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
				{ label: 'Emotion Happy', value: 'ri-emoji-sticker-line' },
				{ label: 'Computer', value: 'ri-mac-line' },
				{ label: 'Device', value: 'ri-device-line' },
				{ label: 'Rest Time', value: 'ri-rest-time-line' },
				{ label: 'Customer Service', value: 'ri-customer-service-line' },
				{ label: 'Shield User', value: 'ri-shield-user-line' },
				{ label: 'Timer Flash', value: 'ri-timer-flash-line' },
				{ label: 'Timer', value: 'ri-timer-line' },
				{ label: 'Pass Valid', value: 'ri-pass-valid-line' },
				{ label: 'Open Arm', value: 'ri-open-arm-line' },
				{ label: 'Speak', value: 'ri-speak-line' },
				{ label: 'Chat Smile', value: 'ri-chat-smile-line' },
				{ label: 'User', value: 'ri-user-line' },
				{ label: 'Signal Tower', value: 'ri-signal-tower-line' },
				{ label: 'Lock Unlock', value: 'ri-lock-unlock-line' }
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
			name: 'threshold_max',
			type: 'number',
			label: 'Seuil (maximum)'
		},
		{
			name: 'levels',
			label: 'Légende',
			type: 'join',
			collection: 'payload-indicator-levels',
			on: 'indicator',
			hasMany: true,
			maxDepth: 2
		}
	],
	timestamps: true
};

export default Indicators;
