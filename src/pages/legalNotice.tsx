import { EmptyScreenZone } from '@/components/generic/EmptyScreenZone';
import { Loader } from '@/components/generic/Loader';
import WysiwygInterpretor from '@/components/generic/WysiwygInterpretor';
import { trpc } from '@/utils/trpc';
import { fr } from '@codegouvfr/react-dsfr';
import Head from 'next/head';

const LegalNotice = () => {
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
				<title>Mentions légales | Vos démarches essentielles</title>
				<meta
					name="description"
					content={`Mentions légales | Vos démarches essentielles`}
				/>
			</Head>
			<div
				className={fr.cx(
					'fr-container',
					'fr-col-lg-10',
					'fr-col-xl-8',
					'fr-py-20v'
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
							{legalsTexts?.['legal-mentions'].title}
						</h1>
						{legalsTexts?.['legal-mentions'].wysiwyg_html && (
							<WysiwygInterpretor wysiwyg_html={legalsTexts?.['legal-mentions'].wysiwyg_html} />
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default LegalNotice;
