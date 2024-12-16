import { EmptyScreenZone } from '@/components/generic/EmptyScreenZone';
import { Loader } from '@/components/generic/Loader';
import WysiwygInterpretor from '@/components/generic/WysiwygInterpretor';
import { trpc } from '@/utils/trpc';
import { fr } from '@codegouvfr/react-dsfr';
import Head from 'next/head';

const TermsOfUse = () => {
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
				<title>
					Modalités d’utilisation de Vos Démarches Essentielles | Vos démarches
					essentielles
				</title>
				<meta
					name="description"
					content={`Modalités d’utilisation de Vos Démarches Essentielles | Vos démarches essentielles`}
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
							{legalsTexts?.['legal-pc'].title}
						</h1>
						{legalsTexts?.['legal-pc'].wysiwyg_html && (
							<WysiwygInterpretor wysiwyg_html={legalsTexts?.['legal-pc'].wysiwyg_html} />
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default TermsOfUse;
