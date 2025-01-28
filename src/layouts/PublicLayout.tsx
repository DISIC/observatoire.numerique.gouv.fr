import { SkipLinks } from '@/components/generic/SkipLinks';
import { CustomFooter } from '@/components/layout/CustomFooter';
import { SocialNetworks } from '@/components/layout/SocialNetworks';
import { useAuth } from '@/providers/Auth';
import { fr } from '@codegouvfr/react-dsfr';
import { Header, HeaderProps } from '@codegouvfr/react-dsfr/Header';
import { tss } from 'tss-react';
import { ReactNode } from 'react';

type Props = {
	children: ReactNode;
};

const PublicLayout = (props: Props) => {
	const { children } = props;
	const { classes, cx } = useStyles();

	const { user } = useAuth();
	const isLogged = !!user;

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
			iconId: 'ri-service-fill',
			linkProps: {
				href: '/observatoire'
			},
			text: 'Tableau de suivi'
		},
		{
			iconId: 'ri-user-star-line',
			linkProps: {
				href: 'https://jedonnemonavis.numerique.gouv.fr',
				target: '_blank',
				title: 'Je donne mon avis, nouvelle fenêtre'
			},
			text: 'Je donne mon avis'
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
