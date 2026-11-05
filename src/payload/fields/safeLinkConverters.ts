import {
	convertLexicalNodesToHTML,
	type HTMLConverter
} from '@payloadcms/richtext-lexical';
import { toSafeHref } from '../../utils/safe-url';

type LinkFields = {
	url?: null | string;
	linkType?: 'custom' | 'internal';
	newTab?: boolean;
	doc?: { value?: unknown } | null;
};

const getHref = (fields: LinkFields | undefined) => {
	if (fields?.linkType === 'internal') {
		const value = fields.doc?.value;
		const id =
			value && typeof value === 'object' && 'id' in value
				? (value as { id: unknown }).id
				: value;
		return toSafeHref(String(id ?? ''));
	}
	return toSafeHref(fields?.url ?? '');
};

// Remplace les convertisseurs link/autolink par défaut : seuls http(s), mailto, tel et les liens relatifs sont gardés
const safeLinkConverter: HTMLConverter<any> = {
	nodeTypes: ['link', 'autolink'],
	converter: async ({
		converters,
		currentDepth,
		depth,
		draft,
		node,
		overrideAccess,
		parent,
		req,
		showHiddenFields
	}) => {
		const childrenText = await convertLexicalNodesToHTML({
			converters,
			currentDepth,
			depth,
			draft,
			lexicalNodes: node.children,
			overrideAccess,
			parent: { ...node, parent },
			req,
			showHiddenFields
		});
		const fields = node.fields as LinkFields | undefined;
		const target = fields?.newTab
			? ' rel="noopener noreferrer" target="_blank"'
			: '';
		return `<a href="${getHref(fields)}"${target}>${childrenText}</a>`;
	}
};

export const safeHTMLConverters = ({
	defaultConverters
}: {
	defaultConverters: HTMLConverter<any>[];
}) => [...defaultConverters, safeLinkConverter];
