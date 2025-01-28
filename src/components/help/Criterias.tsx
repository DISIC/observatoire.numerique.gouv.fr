import { Help } from '@/payload/payload-types';
import { fr } from '@codegouvfr/react-dsfr';
import Link from 'next/link';
import WysiwygInterpretor from '../generic/WysiwygInterpretor';
import { tss } from 'tss-react';

type Props = Help['criterias'];

export function HelpCriterias(props: Props) {
	const { wysiwyg_html, buttonLink, buttonText } = props;
	const { classes } = useStyles();

	return (
		<div className={classes.root}>
			{wysiwyg_html && <WysiwygInterpretor wysiwyg_html={wysiwyg_html} />}
			<Link className={fr.cx('fr-btn', 'fr-mt-4v')} href={buttonLink}>
				{buttonText}
			</Link>
		</div>
	);
}

const useStyles = tss.withName(HelpCriterias.name).create(() => ({
	root: {
		h2: {
			color: fr.colors.decisions.background.actionHigh.blueFrance.default,
			['&:not(:first-of-type)']: {
				marginTop: fr.spacing('10v')
			}
		}
	}
}));
