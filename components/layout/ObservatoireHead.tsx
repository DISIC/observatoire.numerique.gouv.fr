import Head from 'next/head';
import { useRouter } from 'next/router';

export function ObservatoireHead() {
	const router = useRouter();

	let pageTitlePrefix = '';
	let og = {
		title: `L’Observatoire de la qualité des services publics numériques`,
		description: `L’Observatoire recense les services publics numériques les
		plus utilisés et permet d’analyser, chaque trimestre, leur qualité à 
		travers des critères clés, notamment via les retours directs des 
		usagers.`,
		imageUrl: 'https://observatoire.numerique.gouv.fr/assets/observatoire.png'
	};

	switch (router.pathname) {
		case '/':
			pageTitlePrefix = 'Accueil -';
			break;
		case '/observatoire':
			pageTitlePrefix = 'Observatoire -';
			og.title = `Suivi des services numériques phares de l’État`;
			break;
		case '/Aide/Observatoire':
			pageTitlePrefix = "En savoir plus sur l'Observatoire -";
			og.title = 'En savoir plus sur l’Observatoire';
			break;
		case '/demande':
			pageTitlePrefix = 'Soumettre un service -';
			break;
	}

	return (
		<Head>
			<title>
				{pageTitlePrefix} L&#39;Observatoire de la qualité des services
				numériques
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
