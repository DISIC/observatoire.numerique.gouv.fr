import { fr } from '@codegouvfr/react-dsfr';
import Head from 'next/head';
import React from 'react';
import Image from 'next/image';
import { trpc } from '@/utils/trpc';
import { EmptyScreenZone } from '@/components/generic/EmptyScreenZone';
import { Loader } from '@/components/generic/Loader';
import { tss } from 'tss-react';

const Contact = () => {
	const { cx, classes } = useStyles();

	const { data: legalsCMS, isLoading: isLoadingLegalsCMS } =
		trpc.cms.legals.useQuery();
	const legalsTexts = legalsCMS?.data;

	if (isLoadingLegalsCMS) {
		return (
			<EmptyScreenZone>
				<Loader loadingMessage="Chargement du contenu en cours..." />
			</EmptyScreenZone>
		);
	}

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
						<h1 className={fr.cx('fr-mb-5v')}>
							{legalsTexts?.['legal-contact'].title}
						</h1>
						<div className={cx(classes.description)}>
							<p>{legalsTexts?.['legal-contact'].description}</p>
						</div>
					</div>
					<div className={cx(fr.cx('fr-col-12', 'fr-col-md-6', 'fr-col-lg-5'))}>
						{/* @ts-ignore -- Intentionally leaving alt undefined (for decorative image) */}
						<Image
							className={cx(classes.contactImage)}
							src={'/assets/mailto.svg'}
							width={300}
							height={300}
							aria-hidden
						/>
					</div>
				</div>
			</div>
		</>
	);
};

const useStyles = tss.withName(Contact.name).create(() => ({
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
