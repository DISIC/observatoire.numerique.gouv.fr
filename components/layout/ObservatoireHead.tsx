import Head from 'next/head';
import { useRouter } from 'next/router';

export function ObservatoireHead() {
	const router = useRouter();

	let pageTitle =
		'Accueil - Observatoire - Vos démarches numériques essentielles';
	let og = {
		title: `Vos démarches numériques essentielles`,
		description: `Ce dispositif recense les démarches et services numériques
		essentiels, et permet d’analyser, chaque trimestre, leur qualité à
		travers des indicateurs clés.`,
		imageUrl: 'https://observatoire.numerique.gouv.fr/assets/observatoire.png',
		url: 'https://observatoire.numerique.gouv.fr'
	};

	switch (router.pathname) {
		case '/observatoire':
			pageTitle = 'Observatoire - Vos démarches numériques essentielles';
			og.title = `Vos démarches numériques essentielles`;
			break;
		case '/Aide/Observatoire':
			pageTitle = 'En savoir plus - Vos démarches numériques essentielles';
			og.title = 'En savoir plus';
			break;
		case '/demande':
			pageTitle = 'Soumettre une démarche ou un service -';
			break;
	}

	return (
		<Head>
			<title>{pageTitle}</title>
			<meta name="description" content={og.description}></meta>
			<meta property="og:url" content={og.url}></meta>
			<meta property="og:title" content={og.title}></meta>
			<meta property="og:description" content={og.description}></meta>
			<meta property="og:image" content={og.imageUrl}></meta>
		</Head>
	);
}
