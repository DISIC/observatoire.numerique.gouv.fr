import { fr } from '@codegouvfr/react-dsfr';
import Head from 'next/head';
import React from 'react';
import { trpc } from '@/utils/trpc';
import { EmptyScreenZone } from '@/components/generic/EmptyScreenZone';
import { Loader } from '@/components/generic/Loader';

const Accessibility = () => {
	const { data: legalsCMS, isLoading: isLoadingLegalsCMS } =
		trpc.cms.legals.useQuery();
	const legalsTexts = legalsCMS?.data;

	if (
		isLoadingLegalsCMS
	) {
		return (
			<EmptyScreenZone>
				<Loader loadingMessage="Chargement du contenu en cours..." />
			</EmptyScreenZone>
		);
	}

	return (
		<>
			<Head>
				<title>Accessibilité | Je donne mon avis</title>
				<meta
					name="description"
					content={`Accessibilité | Je donne mon avis`}
				/>
			</Head>
			<div
				className={fr.cx(
					'fr-container',
					'fr-col-lg-10',
					'fr-col-xl-8',
					'fr-pt-20v',
					'fr-pb-8v'
				)}
			>
				<div
					className={fr.cx(
						'fr-grid-row',
						'fr-grid-row--gutters',
						'fr-grid-row--middle'
					)}
				>
					<div className={'fr-col-lg-12'}>
						<h1 className={fr.cx('fr-mb-12v')}>
							{legalsTexts?.['legal-a11y'].title}
						</h1>
						{legalsTexts?.['legal-a11y'].wysiwyg_html && (
							<div dangerouslySetInnerHTML={{ __html: legalsTexts?.['legal-a11y'].wysiwyg_html }} />
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Accessibility;
