import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import Link from 'next/link';

export default function NotFound() {
	const { classes, cx } = useStyles();
	return (
		<div className={classes.root}>
			<h1>Oups, cette page n&apos;existe pas</h1>
			<p>
				La page n&apos;existe pas ou n&apos;est pas disponible. Nous vous
				invitions à retourner sur la page d&apos;accueil.
			</p>
			<Link href="/">Retour à la page d&apos;accueil</Link>
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
