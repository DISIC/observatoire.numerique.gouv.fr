import { ProcedureKind } from '@/pages/api/indicator-scores';
import { base64UrlToString, getProcedureKindLabel } from '@/utils/tools';
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
		case '/observatoire/editions':
			pageTitle = 'Éditions - Vos démarches essentielles';
			og.title = 'Éditions';
			break;
		case '/observatoire/editions/[slug]':
		case '/observatoire/old/[slug]':
			const { slug: editionSlug } = router.query as { slug: string };
			pageTitle = `Éditions - Tableau de suivi - ${editionSlug} - Vos démarches essentielles`;
			og.title = `Éditions - Tableau de suivi - ${editionSlug}`;
			break;
		case '/Aide/Observatoire':
			pageTitle =
				'Méthodologie et calcul des indicateurs - Vos démarches essentielles';
			og.title = 'Méthodologie et calcul des indicateurs';
			break;
		case '/demande':
			pageTitle = 'Soumettre une démarche - Vos démarches essentielles';
			break;
		case '/data-viz/[kind]':
		case '/data-viz/procedure':
			const { kind } = router.query;
			const slugTitle =
				getProcedureKindLabel(kind as ProcedureKind, {
					plural: true,
					uppercaseFirst: true
				}) || 'Démarches';
			pageTitle = `Graphiques - ${slugTitle} - Vos démarches essentielles`;
			break;
		case '/data-viz/[kind]/[slug]':
			const { kind: kindDetail, slug } = router.query;
			const procedureTitle = slug
				? base64UrlToString(slug as string)
				: 'Démarche';
			const kindLabel =
				getProcedureKindLabel(kindDetail as ProcedureKind, {
					plural: true,
					uppercaseFirst: true
				}) || 'Démarche';
			pageTitle = `Graphiques - ${procedureTitle} (${kindLabel}) - Vos démarches essentielles`;
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
