import Footer from '@codegouvfr/react-dsfr/Footer';

export function CustomFooter() {
	const brandTop = (
		<>
			RÉPUBLIQUE
			<br />
			FRANÇAISE
		</>
	);

	return (
		<>
			<Footer
				accessibility="partially compliant"
				accessibilityLinkProps={{
					href: 'https://observatoire.numerique.gouv.fr/Main/CGU'
				}}
				brandTop={brandTop}
				contentDescription="L’Observatoire de la qualité des démarches en ligne est un service proposé par l'équipe design des services numériques de la direction interministérielle du numérique (DINUM)."
				cookiesManagementLinkProps={{
					href: 'https://observatoire.numerique.gouv.fr/Main/CGU'
				}}
				homeLinkProps={{
					href: '/',
					title:
						'Accueil - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)'
				}}
				personalDataLinkProps={{
					href: 'https://observatoire.numerique.gouv.fr/Main/CGU#HVieprivE9e'
				}}
				termsLinkProps={{
					href: 'https://observatoire.numerique.gouv.fr/Main/CGU#HMentionslE9gales'
				}}
				websiteMapLinkProps={{
					href: 'https://observatoire.numerique.gouv.fr/Main/plan-site'
				}}
			/>
		</>
	);
}
