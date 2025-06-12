import { fr } from '@codegouvfr/react-dsfr';
import { tss } from 'tss-react';

type WysiwygInterpretorProps = {
	wysiwyg_html: string;
};

const WysiwygInterpretor = (props: WysiwygInterpretorProps) => {
	const { wysiwyg_html } = props;

	const { classes, cx } = useStyles();

	const regexForExternalLink =
		/<a href="([^"]+)"(?=[^>]*\btarget="_blank")(?=[^>]*\brel="noopener noreferrer")[^>]*>([^<]*)/g;
	const newHtml = wysiwyg_html.replace(regexForExternalLink, (_, url, text) => {
		const isSameAsUrl = text === url;
		if (isSameAsUrl) {
			return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}<span class="fr-sr-only">nouvelle fenêtre</span>`;
		} else {
			return `<a href="${url}" target="_blank" rel="noopener noreferrer" title="${text}, nouvelle fenêtre">${text}`;
		}
	});

	return (
		<div
			dangerouslySetInnerHTML={{ __html: newHtml }}
			className={cx(classes.wysiwyg)}
		/>
	);
};

const useStyles = tss.withName(WysiwygInterpretor.name).create(() => ({
	wysiwyg: {
		ul: {
			paddingInlineStart: '2.5rem',
			marginBottom: fr.spacing('4v')
		},
		a: {
			color: fr.colors.decisions.background.actionHigh.blueFrance.hover
		},
		'a[target="_blank"]': {
			marginRight: '0.5rem',
			':after': {
				content: '""',
				'--icon-size': '1rem',
				marginRight: '-0.125rem',
				marginLeft: '0.5rem',
				flex: '0 0 auto',
				display: 'inline-block',
				verticalAlign: 'calc((0.75em - var(--icon-size)) * 0.5)',
				maskSize: '100% 100%',
				maskImage: 'url(/_next/static/media/external-link-line.24fd6719.svg)'
			}
		}
	}
}));

export default WysiwygInterpretor;
