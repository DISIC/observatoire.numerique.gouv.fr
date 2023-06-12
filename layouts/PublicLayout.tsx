import { ReactNode, useEffect, useState } from 'react';
import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { Header, HeaderProps } from '@codegouvfr/react-dsfr/Header';
import { Display } from '@codegouvfr/react-dsfr/Display';
import Head from 'next/head';
import { doesHttpOnlyCookieExist } from '@/utils/cookies';
import { SocialNetworks } from '@/components/layout/SocialNetworks';
import { CustomFooter } from '@/components/layout/CustomFooter';
import { useSession } from 'next-auth/react';
import { SkipLinks } from '@/components/generic/SkipLinks';

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

	const serviceTitle = 'Vos démarches numériques essentielles';
	const serviceTagLine = '';

	useEffect(() => {
		setIsXWikiUserLogged(
			doesHttpOnlyCookieExist('JSESSIONID') &&
				doesHttpOnlyCookieExist('username')
		);
	}, []);

	if (isXWikiUserLogged === undefined) return <></>;

	let accessItems: HeaderProps.QuickAccessItem[] = [
		{
			iconId: 'ri-service-fill',
			linkProps: {
				href: '/observatoire'
			},
			text: 'Tableau de suivi'
		},
		{
			iconId: 'ri-user-star-line',
			linkProps: {
				href: '/je-donne-mon-avis/',
				target: '_self'
			},
			text: "L'outil Je donne mon avis"
		},
		{
			iconId: isXWikiUserLogged
				? 'ri-logout-circle-line'
				: 'ri-login-circle-line',
			linkProps: {
				href: isXWikiUserLogged
					? '/logout/Main/WebHome'
					: '/login/XWiki/XWikiLogin',
				target: '_self'
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
			<div className={fr.cx('fr-container')}>
				<SkipLinks
					links={[
						{ text: 'Contenu', href: '#main' },
						{ text: 'Pied de page', href: '#footer' }
					]}
				/>
			</div>
			<Header
				className={cx(classes.header)}
				brandTop={brandTop}
				homeLinkProps={{
					href: isXWikiUserLogged ? '/Main' : '/',
					target: '_self',
					title:
						"Accueil - L'observatoire de la qualité des services numériques"
				}}
				quickAccessItems={accessItems}
				serviceTagline={serviceTagLine}
				serviceTitle={serviceTitle}
			/>
			<main id="main" role="main">
				{children}
			</main>
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
				'--icon-size:': '0 !important',
				marginLeft: '0px !important',
				marginRight: '0px !important'
			}
		}
	}
}));

export default PublicLayout;
