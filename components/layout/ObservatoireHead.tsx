import Head from 'next/head';
import { useRouter } from 'next/router';

export function ObservatoireHead() {
	const router = useRouter();

	let pageTitle = 'Accueil - Vos démarches essentielles';
	let og = {
		title: `Vos démarches essentielles`,
		description: `Ce dispositif recense les démarches et services numériques
		essentiels, et permet d’analyser, chaque trimestre, leur qualité à
		travers des indicateurs clés.`,
		imageUrl: 'https://observatoire.numerique.gouv.fr/assets/observatoire.png',
		url: 'https://observatoire.numerique.gouv.fr'
	};

	switch (router.pathname) {
		case '/observatoire':
			pageTitle = 'Tableau de suivi - Vos démarches essentielles';
			og.title = `Vos démarches essentielles`;
			break;
		case '/Aide/Observatoire':
			pageTitle = 'En savoir plus - Vos démarches essentielles';
			og.title = 'En savoir plus';
			break;
		case '/demande':
			pageTitle = 'Soumettre une démarche - Vos démarches essentielles';
			break;
	}

	return (
		<Head>
			<title>{pageTitle}</title>
			<link
				rel="icon"
				href="https://observatoire.numerique.gouv.fr/assets/favicon-32x32.ico"
			></link>
			<link
				rel="icon"
				href="https://observatoire.numerique.gouv.fr/assets/favicon-96x96.ico"
			></link>
			<meta name="description" content={og.description}></meta>
			<meta property="og:url" content={og.url}></meta>
			<meta property="og:title" content={og.title}></meta>
			<meta property="og:description" content={og.description}></meta>
			<meta property="og:image" content={og.imageUrl}></meta>
		</Head>
	);
}
