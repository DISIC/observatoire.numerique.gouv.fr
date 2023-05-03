import Head from 'next/head';

export function ObservatoireHead() {
	return (
		<Head>
			<title>L&#39;Observatoire de la qualité des démarches en ligne</title>
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
				content="L’Observatoire de la qualité des démarches en ligne"
			></meta>
			<meta
				property="og:description"
				content="Suivi de la qualité des démarches en ligne pour des services publics numériques de qualité"
			></meta>
			<meta
				property="og:image"
				content="https://observatoire.numerique.gouv.fr/assets/observatoire.png"
			></meta>
		</Head>
	);
}
