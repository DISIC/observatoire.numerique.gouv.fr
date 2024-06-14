import { fr } from '@codegouvfr/react-dsfr';
import Head from 'next/head';
import React from 'react';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import Image from 'next/image';

const Contact = () => {
	const { cx, classes } = useStyles();

	return (
		<>
			<Head>
				<title>Contact | Je donne mon avis</title>
				<meta name="description" content={`Contact | Je donne mon avis`} />
			</Head>
			<div
				className={fr.cx(
					'fr-container',
					'fr-col-lg-10',
					'fr-col-xl-8',
					'fr-py-10v'
				)}
			>
				<div
					className={fr.cx(
						'fr-grid-row',
						'fr-grid-row--gutters',
						'fr-grid-row--middle'
					)}
				>
					<div
						className={fr.cx('fr-col-12', 'fr-col-md-6', 'fr-col-offset-lg-1')}
					>
						<h1 className={fr.cx('fr-mb-5v')}>Nous contacter</h1>
						<div className={cx(classes.description)}>
							<p>
								Vous pouvez nous contacter à l&apos;adresse e-mail suivante :
							</p>
							<p className={cx(fr.cx('fr-text--bold'), classes.email)}>
								observatoire@design.numerique.gouv.fr
							</p>
						</div>
					</div>
					<div className={cx(fr.cx('fr-col-12', 'fr-col-md-6', 'fr-col-lg-5'))}>
						<Image
							className={cx(classes.contactImage)}
							src={'/assets/mailto.svg'}
							alt=""
							width={300}
							height={300}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

const useStyles = makeStyles()(theme => ({
	description: {
		p: {
			marginBottom: '0 !important',
			...fr.typography[21].style
		}
	},
	contactImage: {
		width: '100%'
	},
	email: {
		wordBreak: 'break-word'
	}
}));

export default Contact;
