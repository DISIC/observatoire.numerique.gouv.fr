import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';

type Props = {
	title: string;
};

export function PageTitleHeader(props: Props) {
	const { title } = props;
	const { classes, cx } = useStyles();
	return (
		<div className={classes.root}>
			<div className={fr.cx('fr-container')}>
				<h1>{title}</h1>
			</div>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		backgroundColor: theme.decisions.background.alt.blueFrance.default,
		padding: `${fr.spacing('18v')} 0`,
		textAlign: 'center',
		h1: {
			...fr.typography[11].style,
			marginBottom: 0,
			color: theme.decisions.background.actionHigh.blueFrance.default
		}
	}
}));
