import {
	HTMLConverterFeature,
	lexicalEditor
} from '@payloadcms/richtext-lexical';
import { Field } from 'payload';

export const standardFields: { [key: string]: Field } = {
	title: {
		name: 'title',
		label: 'Titre',
		type: 'text',
		required: true
	},
	description: {
		name: 'description',
		label: 'Description',
		type: 'textarea',
		required: true
	},
	wysiwyg: {
		name: 'wysiwyg',
		label: 'Texte',
		type: 'richText',
		editor: lexicalEditor({
			features: ({ defaultFeatures }) => [
				...defaultFeatures,
				HTMLConverterFeature({})
			]
		})
	},

	button: {
		label: 'Lien associé',
		type: 'collapsible',
		admin: {
			initCollapsed: true
		},
		required: true,
		fields: [
			{
				name: 'buttonText',
				label: 'Texte du bouton',
				type: 'text',
				required: true
			},
			{
				name: 'buttonLink',
				label: 'Lien du bouton',
				type: 'text',
				required: true
			}
		]
	},
	image: {
		name: 'image',
		label: 'Image',
		type: 'upload',
		relationTo: 'payload-media',
		required: true
	}
};
