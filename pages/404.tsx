import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import Link from 'next/link';

export default function NotFound() {
	const { classes, cx } = useStyles();
	return (
		<div className={classes.root}>
			<h1>Oups, cette page n'existe pas</h1>
			<p>
				La page n'existe pas ou n'est pas disponible. Nous vous invitions à
				retourner sur la page d'accueil.
			</p>
			<Link href="/">Retour à la page d'accueil</Link>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		padding: `${fr.spacing('30v')} 0`
	}
}));
