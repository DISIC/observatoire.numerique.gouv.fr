import { Help } from '@/payload/payload-types';
import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';

type Props = Help['goals'];

export function HelpGoals(props: Props) {
	const { wysiwyg_html } = props;
	const { classes, cx } = useStyles();

	return (
		<div className={classes.root}>
			{wysiwyg_html && (
				<div dangerouslySetInnerHTML={{ __html: wysiwyg_html }} />
			)}
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		h2: {
			color: theme.decisions.background.actionHigh.blueFrance.default,
			['&:not(:first-of-type)']: {
				marginTop: fr.spacing('10v')
			}
		}
	}
}));
