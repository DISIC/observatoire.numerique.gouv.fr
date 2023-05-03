import { ReactNode } from 'react';
import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { Header } from '@codegouvfr/react-dsfr/Header';
import { signOut } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { CustomFooter } from '@/components/layout/CustomFooter';

const PublicLayout = ({ children }: { children: ReactNode }) => {
	const { classes, cx } = useStyles();

	const router = useRouter();

	const brandTop = (
		<>
			RÉPUBLIQUE
			<br />
			FRANÇAISE
		</>
	);

	const serviceTitle = 'Administration';
	const serviceTagLine = "de l'observatoire des démarches en ligne";

	return (
		<>
			<Header
				className={classes.header}
				brandTop={brandTop}
				homeLinkProps={{
					href: '/administration',
					title:
						"Administration - L'observatoire de la qualité des démarches en ligne"
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
							onClick: () => {
								signOut();
							}
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
