import { standardFields } from '@/payload/fields/standards';
import { lexicalHTML } from '@payloadcms/richtext-lexical';
import { GlobalConfig } from 'payload';

export const CMSLegals: GlobalConfig = {
	slug: 'legals',
	label: 'CMS - Pages du footer',
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					label: 'Mentions légales',
					name: 'legal-mentions',
					fields: [
						standardFields.title,
						standardFields.wysiwyg,
						lexicalHTML('wysiwyg', { name: 'wysiwyg_html' })
					]
				}
			]
		}
	]
};
