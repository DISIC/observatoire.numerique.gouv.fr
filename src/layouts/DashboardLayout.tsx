import { CustomFooter } from '@/components/layout/CustomFooter';
import { useAuth } from '@/providers/Auth';
import { fr } from '@codegouvfr/react-dsfr';
import { Header } from '@codegouvfr/react-dsfr/Header';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { tss } from 'tss-react';

const PublicLayout = ({ children }: { children: ReactNode }) => {
	const { classes } = useStyles();

	const router = useRouter();

	const { logout } = useAuth();

	const brandTop = (
		<>
			RÉPUBLIQUE
			<br />
			FRANÇAISE
		</>
	);

	const serviceTitle = 'Administration';
	const serviceTagLine = 'de vos démarches essentielles';

	const signOut = async () => {
		await logout();
		router.push('/');
	};

	return (
		<>
			<Header
				className={classes.header}
				brandTop={brandTop}
				homeLinkProps={{
					href: '/administration',
					title: 'Administration - Vos démarches essentielles'
				}}
				quickAccessItems={[
					{
						iconId: 'ri-service-fill',
						linkProps: {
							href: '/',
							target: '_self'
						},
						text: 'Retour au site'
					},
					{
						iconId: 'ri-service-fill',
						buttonProps: {
							onClick: signOut
						},
						text: 'Déconnexion'
					}
				]}
				navigation={[
					{
						isActive: router.pathname === '/administration/bo/grist',
						linkProps: {
							href: '/administration/bo/grist',
							target: '_self'
						},
						text: 'Prévisualisation Grist'
					},
					{
						isActive: router.pathname.startsWith('/administration/bo/editions'),
						linkProps: {
							href: '/administration/bo/editions',
							target: '_self'
						},
						text: 'Mes Éditions'
					},
					{
						isActive: false,
						linkProps: {
							href: '/admin',
							target: '_blank'
						},
						text: 'Payload CMS'
					}
				]}
				serviceTagline={serviceTagLine}
				serviceTitle={serviceTitle}
			/>
			{children}
			<CustomFooter />
		</>
	);
};

const useStyles = tss.withName(PublicLayout.name).create(() => ({
	header: {
		[fr.breakpoints.up('lg')]: {
			['.fr-btn::before']: {
				'--icon-size:': '0 !important'
			}
		}
	}
}));

export default PublicLayout;
