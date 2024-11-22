import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';

type Props = {
	title: JSX.Element;
	description: JSX.Element;
};

export function Questions(props: Props) {
	const { title, description } = props;
	const { classes, cx } = useStyles();

	return (
		<div className={cx(fr.cx('fr-container'), classes.root)}>
			<h2>{title}</h2>
			<p>{description}</p>
			<Button
				type="button"
				priority="secondary"
				className={classes.contactButton}
				onClick={() => {
					'/contact/';
				}}
			>
				Contacer notre équipe
			</Button>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		maxWidth: '62rem',
		paddingTop: fr.spacing('14v'),
		paddingBottom: fr.spacing('14v'),
		textAlign: 'center',
		h2: {
			...fr.typography[4].style,
			color: theme.decisions.background.actionHigh.blueFrance.default
		},
		p: {
			marginTop: fr.spacing('2v')
		}
	},
	contactButton: {
		backgroundColor: theme.decisions.background.default.grey.default
	}
}));
