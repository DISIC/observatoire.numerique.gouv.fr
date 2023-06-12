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
					href: '/Main/CGU'
				}}
				brandTop={brandTop}
				contentDescription="Vos démarches numériques essentielles est un service proposé par l'équipe design des services numériques (DesignGouv) de la direction interministérielle du numérique (DINUM)."
				cookiesManagementLinkProps={{
					href: '/Main/CGU'
				}}
				homeLinkProps={{
					href: '/',
					title:
						'Accueil - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)'
				}}
				personalDataLinkProps={{
					href: '/Main/CGU#HVieprivE9e'
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
