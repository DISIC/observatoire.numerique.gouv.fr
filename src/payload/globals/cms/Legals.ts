import { standardFields } from '@/payload/fields/standards';
import { lexicalHTML } from '@payloadcms/richtext-lexical';
import { GlobalConfig } from 'payload';

export const CMSLegals: GlobalConfig = {
	slug: 'legals',
	label: 'CMS - Pages du footer',
	access: {
		read: () => true
	},
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					label: 'Accessibilité',
					name: 'legal-a11y',
					fields: [
						standardFields.title,
						standardFields.wysiwyg,
						lexicalHTML('wysiwyg', { name: 'wysiwyg_html' })
					]
				},
				{
					label: 'Mentions légales',
					name: 'legal-mentions',
					fields: [
						standardFields.title,
						standardFields.wysiwyg,
						lexicalHTML('wysiwyg', { name: 'wysiwyg_html' })
					]
				},
				{
					label: 'Politique de confidentialité',
					name: 'legal-pc',
					fields: [
						standardFields.title,
						standardFields.wysiwyg,
						lexicalHTML('wysiwyg', { name: 'wysiwyg_html' })
					]
				},
				{
					label: "Modalités d'utilisation",
					name: 'legal-terms',
					fields: [
						standardFields.title,
						standardFields.wysiwyg,
						lexicalHTML('wysiwyg', { name: 'wysiwyg_html' })
					]
				},
				{
					label: "Contact",
					name: 'legal-contact',
					fields: [
						standardFields.title,
						standardFields.description
					]
				}
			]
		}
	]
};
