import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';

type Props = {};

export function IndicatorProactive(props: Props) {
	const { classes, cx } = useStyles();
	return (
		<div className={classes.root}>
			<i className={fr.cx('ri-dvd-line')} />
			<p>
				Grâce au partage d’informations entre administrations, ce service est
				rendu proactif et octroie directement les droits au citoyen ou usager...
			</p>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		display: 'flex',
		textAlign: 'left',
		marginLeft: fr.spacing('10v'),
		i: {
			['&::before']: {
				'--icon-size': '0.875rem !important'
			}
		},
		p: {
			marginBottom: 0,
			marginLeft: fr.spacing('2v'),
			...fr.typography[18]
		}
	}
}));
