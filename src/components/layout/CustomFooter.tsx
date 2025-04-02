import Footer from '@codegouvfr/react-dsfr/Footer';
import { headerFooterDisplayItem } from '@codegouvfr/react-dsfr/Display';
import { trpc } from '@/utils/trpc';

export function CustomFooter() {
	const { data: footerCMS, isLoading: isLoadingFooterCMS } =
		trpc.cms.footer.useQuery();
	const footerTexts = footerCMS?.data;

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
				id="footer"
				accessibility="partially compliant"
				accessibilityLinkProps={{
					href: '/accessibilite'
				}}
				brandTop={brandTop}
				contentDescription={footerTexts?.description}
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
