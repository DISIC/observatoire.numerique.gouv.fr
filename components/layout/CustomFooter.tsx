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
					href: '/accessibilite'
				}}
				brandTop={brandTop}
				contentDescription="Vos démarches essentielles est un service proposé par l'équipe design des services numériques (DesignGouv) de la direction interministérielle du numérique (DINUM)."
				homeLinkProps={{
					href: '/',
					title: 'Accueil - Vos démarches essentielles'
				}}
				personalDataLinkProps={{
					href: '/cgu'
				}}
				termsLinkProps={{
					href: '/legalNotice'
				}}
				bottomItems={[
					{
						text: 'Modalités d’utilisation',
						linkProps: { href: '/termsOfUse' }
					},
					{ text: 'Contact', linkProps: { href: '/contact' } }
				]}
			/>
		</>
	);
}
