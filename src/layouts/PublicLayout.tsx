import { SkipLinks } from '@/components/generic/SkipLinks';
import { CustomFooter } from '@/components/layout/CustomFooter';
import { SocialNetworks } from '@/components/layout/SocialNetworks';
import { useAuth } from '@/providers/Auth';
import { fr } from '@codegouvfr/react-dsfr';
import { Header, HeaderProps } from '@codegouvfr/react-dsfr/Header';
import { tss } from 'tss-react';
import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useEdition } from '@/utils/api';

type Props = {
	children: ReactNode;
};

const PublicLayout = (props: Props) => {
	const { children } = props;
	const { classes, cx } = useStyles();

	const router = useRouter();

	const { user } = useAuth();
	const isLogged = !!user;

	const { data: currentEdition } = useEdition({
		id: 'current',
		kind: 'id'
	});

	const brandTop = (
		<>
			RÉPUBLIQUE
			<br />
			FRANÇAISE
		</>
	);

	const serviceTitle = 'Vos démarches essentielles';
	const serviceTagLine = '';

	let accessItems: HeaderProps.QuickAccessItem[] = [
		{
			iconId: 'ri-user-star-line',
			linkProps: {
				href: 'https://jedonnemonavis.numerique.gouv.fr',
				target: '_blank',
				title: 'Je donne mon avis, nouvelle fenêtre'
			},
			text: 'Je donne mon avis'
		},
		{
			iconId: 'ri-user-star-line',
			linkProps: {
				href: 'https://www.data.gouv.fr/fr/datasets/observatoire-de-la-qualite-des-demarches-en-ligne',
				target: '_blank',
				title: 'Nos données sur data.gouv.fr, nouvelle fenêtre'
			},
			text: 'Nos données sur data.gouv.fr'
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
					href: '/',
					target: '_self',
					title: 'Accueil - Vos démarches essentielles'
				}}
				navigation={[
					{
						linkProps: {
							href: '/',
							target: '_self'
						},
						isActive: router.pathname === '/',
						text: 'Accueil'
					},
					{
						linkProps: {
							href: '/observatoire',
							target: '_self'
						},
						isActive: router.pathname === '/observatoire',

						text: `Edition ${currentEdition?.name.toLowerCase() || ''}`
					},
					{
						linkProps: {
							href: '/Aide/Observatoire',
							target: '_self'
						},
						isActive: router.pathname === '/Aide/Observatoire',
						text: 'Tout comprendre sur les indicateurs'
					},
					{
						linkProps: {
							href: '/data-viz',
							target: '_self'
						},
						isActive: router.pathname.startsWith('/data-viz'),
						text: 'DataViz'
					},
					{
						linkProps: {
							href: '/observatoire/editions',
							target: '_self'
						},
						isActive:
							router.pathname.startsWith('/observatoire/editions') ||
							router.pathname.startsWith('/observatoire/old'),
						text: 'Éditions précédentes'
					}
				]}
				quickAccessItems={accessItems}
				// serviceTagline={serviceTagLine}
				serviceTitle={serviceTitle}
			/>
			<main id="main" role="main">
				{children}
			</main>
			<SocialNetworks />
			<CustomFooter />
		</>
	);
};

const useStyles = tss.withName(PublicLayout.name).create(() => ({
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
