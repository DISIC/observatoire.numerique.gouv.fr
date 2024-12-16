import { fr } from '@codegouvfr/react-dsfr';
import Head from 'next/head';
import React from 'react';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { trpc } from '@/utils/trpc';

const LegalNotice = () => {
	const { cx, classes } = useStyles();


	const { data: legalsCMS, isLoading: isLoadingLegalsCMS } =
		trpc.cms.legals.useQuery();
	const legalsTexts = legalsCMS?.data;

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
							<div dangerouslySetInnerHTML={{ __html: legalsTexts?.['legal-mentions'].wysiwyg_html }} />
						)}
					</div>
				</div>
			</div>
		</>
	);
};

const useStyles = makeStyles()(theme => ({
	blockWrapper: {
		display: 'flex',
		flexDirection: 'column',
		marginBottom: '1rem',

		a: {
			width: 'fit-content'
		},
		ul: {
			margin: '2rem 0 2rem 2rem'
		}
	},
	noSpacesParagraph: {
		marginBottom: '0 !important'
	}
}));

export default LegalNotice;
