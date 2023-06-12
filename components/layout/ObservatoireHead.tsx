import Head from 'next/head';
import { useRouter } from 'next/router';

export function ObservatoireHead() {
	const router = useRouter();

	let pageTitlePrefix = '';
	let og = {
		title: `Vos démarches numériques essentielles`,
		description: `Ce dispositif recense les démarches et services numériques
		essentiels, et permet d’analyser, chaque trimestre, leur qualité à
		travers des indicateurs clés.`,
		imageUrl: 'https://observatoire.numerique.gouv.fr/assets/observatoire.png'
	};

	switch (router.pathname) {
		case '/':
			pageTitlePrefix = 'Accueil -';
			break;
		case '/observatoire':
			pageTitlePrefix = 'Observatoire -';
			og.title = `Vos démarches numériques essentielles`;
			break;
		case '/Aide/Observatoire':
			pageTitlePrefix = "En savoir plus -";
			og.title = 'En savoir plus';
			break;
		case '/demande':
			pageTitlePrefix = 'Soumettre une démarche ou un service -';
			break;
	}

	return (
		<Head>
			<title>
				{pageTitlePrefix} Vos démarches numériques essentielles
			</title>
			<meta name="description" content={og.description}></meta>
			<meta property="og:url" content={og.imageUrl}></meta>
			<meta property="og:title" content={og.title}></meta>
			<meta property="og:description" content={og.description}></meta>
			<meta
				property="og:image"
				content="https://observatoire.numerique.gouv.fr/assets/observatoire.png"
			></meta>
		</Head>
	);
}
