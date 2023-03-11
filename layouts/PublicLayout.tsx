import { ReactNode } from 'react';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { Header } from '@codegouvfr/react-dsfr/Header';
import { Footer } from '@codegouvfr/react-dsfr/Footer';
import {
	Display,
	headerFooterDisplayItem
} from '@codegouvfr/react-dsfr/Display';
import Head from 'next/head';

const PublicLayout = ({ children }: { children: ReactNode }) => {
	const { classes, cx } = useStyles();

	const brandTop = (
		<>
			RÉPUBLIQUE
			<br />
			FRANÇAISE
		</>
	);

	const serviceTitle = "L'Observatoire de la qualité";
	const serviceTagLine = 'des démarches en ligne';

	return (
		<>
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
					property="og:image"
					content="https://observatoire.numerique.gouv.fr/static/observatoire.png"
				></meta>
			</Head>
			<Header
				className={cx(classes.header)}
				brandTop={brandTop}
				homeLinkProps={{
					href: '/',
					title:
						'Accueil - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)'
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
						text: "L'outil Je donne mon avis"
					},
					{
						iconId: 'fr-icon-add-circle-line',
						linkProps: {
							href: '#'
						},
						text: 'Connexion'
					},
					// ONLY FOR TEST PURPOSE
					headerFooterDisplayItem
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
					title:
						'Accueil - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)'
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
			<Display />
		</>
	);
};

const useStyles = makeStyles()(theme => ({
	header: {
		['.fr-btn::before']: {
			'--icon-size:': '0 !important'
		}
	}
}));

export default PublicLayout;
