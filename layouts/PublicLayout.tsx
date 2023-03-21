import { ReactNode, useEffect, useState } from 'react';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { Header } from '@codegouvfr/react-dsfr/Header';
import { Footer } from '@codegouvfr/react-dsfr/Footer';
import {
	Display,
	headerFooterDisplayItem
} from '@codegouvfr/react-dsfr/Display';
import Head from 'next/head';
import { getCookie } from '@/utils/cookies';
import { SocialNetworks } from '@/components/layout/SocialNetworks';

const PublicLayout = ({ children }: { children: ReactNode }) => {
	const { classes, cx } = useStyles();

	const [isUserLogged, setIsUserLogged] = useState<boolean>();

	const brandTop = (
		<>
			RÉPUBLIQUE
			<br />
			FRANÇAISE
		</>
	);

	const serviceTitle = "L'Observatoire de la qualité";
	const serviceTagLine = 'des démarches en ligne';

	useEffect(() => {
		setIsUserLogged(!!getCookie('username') && !!getCookie('JSESSIONID'));
	}, []);

	if (isUserLogged === undefined) return <></>;

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
							href: 'https://observatoire.numerique.gouv.fr/je-donne-mon-avis/'
						},
						text: "L'outil Je donne mon avis"
					},
					{
						iconId: 'fr-icon-add-circle-line',
						linkProps: {
							href: isUserLogged
								? 'https://observatoire.numerique.gouv.fr/logout/Main/WebHome'
								: 'https://observatoire.numerique.gouv.fr/login/XWiki/XWikiLogin?xredirect=%2Fobservatoire%2F'
						},
						text: isUserLogged ? 'Déconnexion' : 'Connexion'
					}
					// ONLY FOR TEST PURPOSE
					// headerFooterDisplayItem
				]}
				serviceTagline={serviceTagLine}
				serviceTitle={serviceTitle}
			/>
			{children}
			<SocialNetworks />
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
