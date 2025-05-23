import { Help } from '@/payload/payload-types';
import { fr } from '@codegouvfr/react-dsfr';
import WysiwygInterpretor from '../generic/WysiwygInterpretor';
import { tss } from 'tss-react';

type Props = Help['goals'];

export function HelpGoals(props: Props) {
	const { wysiwyg_html } = props;
	const { classes, cx } = useStyles();

	return (
		<div className={classes.root}>
			{wysiwyg_html && <WysiwygInterpretor wysiwyg_html={wysiwyg_html} />}
		</div>
	);
}

const useStyles = tss.withName(HelpGoals.name).create(() => ({
	root: {
		h2: {
			color: fr.colors.decisions.background.actionHigh.blueFrance.default,
			['&:not(:first-of-type)']: {
				marginTop: fr.spacing('10v')
			}
		}
	}
}));
