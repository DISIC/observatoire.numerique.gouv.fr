import { CustomFooter } from '@/components/layout/CustomFooter';
import { useAuth } from '@/providers/Auth';
import { fr } from '@codegouvfr/react-dsfr';
import { Header } from '@codegouvfr/react-dsfr/Header';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

const PublicLayout = ({ children }: { children: ReactNode }) => {
	const { classes, cx } = useStyles();

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
		await logout()
		deleteCookie(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME ?? "obs-jwt")
		router.push('/')
	}

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
						isActive: router.pathname === '/administration/bo/airtable',
						linkProps: {
							href: '/administration/bo/airtable',
							target: '_self'
						},
						text: 'Prévisualisation Airtable'
					},
					{
						isActive: router.pathname.startsWith('/administration/bo/editions'),
						linkProps: {
							href: '/administration/bo/editions',
							target: '_self'
						},
						text: 'Mes Éditions'
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
