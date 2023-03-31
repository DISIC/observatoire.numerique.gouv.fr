import { ReactNode, useEffect, useState } from 'react';
import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { Header, HeaderProps } from '@codegouvfr/react-dsfr/Header';
import { Display } from '@codegouvfr/react-dsfr/Display';
import Head from 'next/head';
import { getCookie } from '@/utils/cookies';
import { SocialNetworks } from '@/components/layout/SocialNetworks';
import { CustomFooter } from '@/components/layout/CustomFooter';
import { useSession } from 'next-auth/react';

type Props = {
	children: ReactNode;
};

const PublicLayout = (props: Props) => {
	const { children } = props;
	const { classes, cx } = useStyles();
	const session = useSession();
	const isLogged = !!session.data;

	const [isXWikiUserLogged, setIsXWikiUserLogged] = useState<boolean>();

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
		setIsXWikiUserLogged(!!getCookie('username') && !!getCookie('JSESSIONID'));
	}, []);

	if (isXWikiUserLogged === undefined) return <></>;

	let accessItems: HeaderProps.QuickAccessItem[] = [
		{
			iconId: 'ri-service-fill',
			linkProps: {
				href: '/observatoire'
			},
			text: 'Suivi des services phares'
		},
		{
			iconId: 'ri-user-star-line',
			linkProps: {
				href: 'https://observatoire.numerique.gouv.fr/je-donne-mon-avis/'
			},
			text: "L'outil Je donne mon avis"
		},
		{
			iconId: isXWikiUserLogged
				? 'ri-logout-circle-line'
				: 'ri-login-circle-line',
			linkProps: {
				href: isXWikiUserLogged
					? 'https://observatoire.numerique.gouv.fr/logout/Main/WebHome'
					: 'https://observatoire.numerique.gouv.fr/login/XWiki/XWikiLogin?xredirect=%2Fobservatoire%2F'
			},
			text: isXWikiUserLogged ? 'Déconnexion' : 'Connexion'
		}
	];

	if (isLogged)
		accessItems.unshift({
			iconId: 'ri-user-star-line',
			linkProps: {
				href: '/administration'
			},
			text: 'Administration'
		});

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
				quickAccessItems={accessItems}
				serviceTagline={serviceTagLine}
				serviceTitle={serviceTitle}
			/>
			{children}
			<SocialNetworks />
			<CustomFooter />
			<Display />
		</>
	);
};

const useStyles = makeStyles()(theme => ({
	header: {
		[fr.breakpoints.up('lg')]: {
			['.fr-btn::before']: {
				'--icon-size:': '0 !important'
			}
		}
	}
}));

export default PublicLayout;
