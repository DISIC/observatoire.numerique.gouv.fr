import Footer from '@codegouvfr/react-dsfr/Footer';
import { headerFooterDisplayItem } from '@codegouvfr/react-dsfr/Display';

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
				termsLinkProps={{
					href: '/legalNotice'
				}}
				bottomItems={[
					{
						text: 'Données personnelles',
						linkProps: { href: '/cgu' }
					},
					{
						text: 'Modalités d’utilisation',
						linkProps: { href: '/termsOfUse' }
					},
					{ text: 'Contact', linkProps: { href: '/contact' } },
					{
						text: 'Code source',
						linkProps: {
							href: 'https://github.com/DISIC/observatoire.numerique.gouv.fr',
							title: 'Code source, nouvelle fenêtre'
						}
					},
					headerFooterDisplayItem
				]}
			/>
		</>
	);
}
