import Head from 'next/head';
import { useRouter } from 'next/router';

export function ObservatoireHead() {
	const router = useRouter();

	let pageTitlePrefix = '';
	switch (router.pathname) {
		case '/':
			pageTitlePrefix = 'Accueil -';
			break;
		case '/observatoire':
			pageTitlePrefix = 'Observatoire -';
			break;
		case '/Aide/Observatoire':
			pageTitlePrefix = "En savoir plus sur l'Observatoire -";
			break;
	}

	return (
		<Head>
			<title>
				{pageTitlePrefix} L&#39;Observatoire de la qualité des services
				numériques
			</title>
			<meta
				name="description"
				content="Pour des services publics numériques de qualité"
			></meta>
			<meta
				property="og:url"
				content="https://observatoire.numerique.gouv.fr"
			></meta>
			<meta
				property="og:title"
				content="L’Observatoire de la qualité des services numériques"
			></meta>
			<meta
				property="og:description"
				content="Suivi de la qualité des services numériques pour des services publics numériques de qualité"
			></meta>
			<meta
				property="og:image"
				content="https://observatoire.numerique.gouv.fr/assets/observatoire.png"
			></meta>
		</Head>
	);
}
