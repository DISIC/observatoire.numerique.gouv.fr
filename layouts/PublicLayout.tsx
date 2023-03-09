import { ReactNode } from "react";
import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer"

const PublicLayout = ({ children }: { children: ReactNode }) => {
	const brandTop = <>RÉPUBLIQUE<br />FRANÇAISE</>
	const serviceTitle = "L'Observatoire de la qualité"
	const serviceTagLine = "des démarches en ligne"

	return (
		<>
			<Header
				brandTop={brandTop}
				homeLinkProps={{
					href: '/',
					title: 'Accueil - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)'
				}}
				quickAccessItems={[
					{
						iconId: 'fr-icon-add-circle-line',
						linkProps: {
							href: '/observatoire'
						},
						text: 'Suivi des services phares'
					},
					{
						iconId: 'fr-icon-add-circle-line',
						linkProps: {
							href: '#'
						},
						text: 'L\'outil Je donne mon avis'
					},
					{
						iconId: 'fr-icon-add-circle-line',
						linkProps: {
							href: '#'
						},
						text: 'Connexion'
					}
				]}
				serviceTagline={serviceTagLine}
				serviceTitle={serviceTitle}
			/>
			{children}
			<Footer
				accessibility="fully compliant"
				brandTop={brandTop}
				contentDescription="L’Observatoire de la qualité des démarches en ligne est un service proposé par l'équipe design des services numériques de la direction interministérielle du numérique (DINUM)."
				cookiesManagementLinkProps={{
					href: '#'
				}}
				homeLinkProps={{
					href: '/',
					title: 'Accueil - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)'
				}}
				personalDataLinkProps={{
					href: '#'
				}}
				termsLinkProps={{
					href: '#'
				}}
				websiteMapLinkProps={{
					href: '#'
				}}

			/>
		</>
	)
}

export default PublicLayout;