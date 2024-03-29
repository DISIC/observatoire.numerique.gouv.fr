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
					href: '/Main/Accessibilite'
				}}
				brandTop={brandTop}
				contentDescription="Vos démarches essentielles est un service proposé par l'équipe design des services numériques (DesignGouv) de la direction interministérielle du numérique (DINUM)."
				homeLinkProps={{
					href: '/',
					title: 'Accueil - Vos démarches essentielles'
				}}
				personalDataLinkProps={{
					href: '/Main/CGU'
				}}
				termsLinkProps={{
					href: '/Main/CGU#HMentionslE9gales'
				}}
				websiteMapLinkProps={{
					href: '/Main/plan-site'
				}}
				bottomItems={[{ text: 'Contact', linkProps: { href: '/contact' } }]}
			/>
		</>
	);
}
