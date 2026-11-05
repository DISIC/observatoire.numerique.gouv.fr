const ALLOWED_SCHEMES = new Set(['http', 'https', 'mailto', 'tel']);
const SCHEME_PATTERN = /^([a-z][a-z0-9+.-]*):/i;
const UNSAFE_HREF = '#';

// Caractères ignorés par les navigateurs dans une URL
// eslint-disable-next-line no-control-regex
const IGNORED_URL_CHARS = /[\u0000- \u007f-\u009f]/g;

const NAMED_ENTITIES: Record<string, string> = {
	amp: '&',
	quot: '"',
	apos: "'",
	lt: '<',
	gt: '>',
	colon: ':',
	sol: '/',
	quest: '?',
	num: '#',
	tab: '\t',
	newline: '\n',
	nbsp: ' '
};

const decodeEntities = (value: string) =>
	value.replace(
		/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);?/gi,
		(match, entity: string) => {
			if (entity[0] === '#') {
				const code =
					entity[1] === 'x' || entity[1] === 'X'
						? parseInt(entity.slice(2), 16)
						: parseInt(entity.slice(1), 10);
				return Number.isFinite(code) && code >= 0 && code <= 0x10ffff
					? String.fromCodePoint(code)
					: '';
			}
			return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
		}
	);

export const isSafeUrl = (rawUrl: unknown): boolean => {
	if (typeof rawUrl !== 'string') return false;

	const url = rawUrl.replace(IGNORED_URL_CHARS, '');
	const beforePathEnd = url.split(/[/?#]/, 1)[0];

	const scheme = SCHEME_PATTERN.exec(beforePathEnd);
	if (scheme) return ALLOWED_SCHEMES.has(scheme[1].toLowerCase());

	return !/[:&\\]/.test(beforePathEnd);
};

export const isSafeHrefAttribute = (attributeValue: string) =>
	isSafeUrl(decodeEntities(attributeValue));

export const escapeHtmlAttribute = (value: string) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');

export const toSafeHref = (rawUrl: unknown) =>
	isSafeUrl(rawUrl) ? escapeHtmlAttribute(String(rawUrl)) : UNSAFE_HREF;

const HREF_ATTRIBUTE =
	/(\s(?:href|xlink:href|formaction|action)\s*=\s*)("([^"]*)"|'([^']*)'|([^\s>"'=<`]+))/gi;

export const sanitizeHtmlLinks = (html: string) =>
	html.replace(
		HREF_ATTRIBUTE,
		(
			match,
			prefix: string,
			_quoted,
			dq?: string,
			sq?: string,
			bare?: string
		) => {
			const value = dq ?? sq ?? bare ?? '';
			return isSafeHrefAttribute(value) ? match : `${prefix}"${UNSAFE_HREF}"`;
		}
	);
