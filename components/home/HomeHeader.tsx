import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';

type Props = {
	title: JSX.Element;
	description: JSX.Element;
};

export function HomeHeader(props: Props) {
	const { title, description } = props;
	const { classes, cx } = useStyles();

	return (
		<div className={classes.root}>
			<div className={cx(fr.cx('fr-container'), classes.container)}>
				<h1>{title}</h1>
				<p>{description}</p>
			</div>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		backgroundColor: theme.decisions.background.alt.blueFrance.default
	},
	container: {
		maxWidth: '55rem',
		paddingTop: fr.spacing('18v'),
		paddingBottom: fr.spacing('18v'),
		h1: {
			color: theme.decisions.background.actionHigh.blueFrance.default,
			...fr.typography[11].style
		},
		[fr.breakpoints.down('sm')]: {
			textAlign: 'center'
		}
	}
}));
