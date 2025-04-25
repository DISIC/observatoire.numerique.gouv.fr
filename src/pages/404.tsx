import { fr } from '@codegouvfr/react-dsfr';
import Link from 'next/link';
import { tss } from 'tss-react';

export default function NotFound() {
	const { classes } = useStyles();
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

const useStyles = tss.withName(NotFound.name).create(() => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		padding: `${fr.spacing('30v')} 0`
	}
}));
