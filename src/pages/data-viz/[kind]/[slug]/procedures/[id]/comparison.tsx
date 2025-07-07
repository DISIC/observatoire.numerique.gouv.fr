import ProcedureIndicatorsGridItem from '@/components/data-viz/ProcedureIndicatorsGridItem';
import { EmptyScreenZone } from '@/components/generic/EmptyScreenZone';
import { Loader } from '@/components/generic/Loader';
import { ProcedureKind } from '@/pages/api/indicator-scores';
import { useProcedureById } from '@/utils/api';
import { isValidIndicatorSlug } from '@/utils/data-viz-client';
import { base64UrlToString, exportTableAsCSV } from '@/utils/tools';
import { trpc } from '@/utils/trpc';
import { fr } from '@codegouvfr/react-dsfr';
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb';
import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { tss } from 'tss-react';

const ProcedureComparison = () => {
	const { classes, cx } = useStyles();
	const router = useRouter();
	const {
		kind,
		slug: tmpSlug,
		id
	} = router.query as {
		kind: ProcedureKind;
		slug: string;
		id: string;
	};
	const slug = tmpSlug ? base64UrlToString(tmpSlug) : '';

	const [dataVisualitionKind, setDataVisualitionKind] = useState<
		'list' | 'table'
	>('list');
	const [selectedKindValue, setSelectedKindValue] = useState<string>('');

	const { data: procedure, isError, isLoading } = useProcedureById(id);

	const { data: procdeureHeadersRequest, isLoading: isLoadingIndicators } =
		trpc.indicators.getList.useQuery({
			page: 1,
			perPage: 100
		});
	const indicators =
		procdeureHeadersRequest?.data.filter(indicator =>
			isValidIndicatorSlug(indicator.slug)
		) || [];

	return (
		<div className={cx(classes.root)}>
			<div className="fr-container">
				<Breadcrumb
					segments={[
						{
							label: 'Accueil',
							linkProps: { href: '/' }
						},
						{
							label: 'Dataviz',
							linkProps: { href: '/data-viz' }
						},
						{
							label: `Démarches du périmètre ${slug}`,
							linkProps: { href: `/data-viz/${kind}/${tmpSlug}/procedures` }
						}
					]}
					currentPageLabel={`Comparer la démarche ${procedure?.title}`}
					className={cx('fr-mb-1v')}
				/>
				<h1>Comparer la démarche "{procedure?.title}"</h1>
				<div className={classes.pageContent}>
					<div className={classes.actions}>
						<div>
							<div className={classes.buttonsGroup}>
								<Button
									iconId="ri-list-unordered"
									onClick={() => setDataVisualitionKind('list')}
									priority={
										dataVisualitionKind === 'list' ? 'primary' : 'secondary'
									}
									title="Chart"
								/>
								<Button
									iconId="ri-table-line"
									onClick={() => setDataVisualitionKind('table')}
									priority={
										dataVisualitionKind === 'table' ? 'primary' : 'secondary'
									}
									title="Table"
									disabled={selectedKindValue === ''}
								/>
							</div>
							<Button
								iconId="ri-download-line"
								priority={'secondary'}
								title="Exporter"
								onClick={() => {
									exportTableAsCSV('table', slug);
								}}
							>
								Exporter
							</Button>
						</div>
					</div>
					{!isLoading && procedure ? (
						<div className={cx(classes.grid)}>
							<ProcedureIndicatorsGridItem
								procedure={procedure}
								indicators={indicators}
								showCompareButton={false}
							/>
						</div>
					) : (
						<EmptyScreenZone>
							<Loader loadingMessage="Chargement du contenu en cours..." />
						</EmptyScreenZone>
					)}
				</div>
			</div>
		</div>
	);
};

const useStyles = tss.withName(ProcedureComparison.name).create(() => ({
	root: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
		padding: `${fr.spacing('8v')} 0`,
		['& > div  > h1']: {
			lineHeight: '2.25rem',
			fontSize: '1.75rem'
		}
	},
	pageContent: {
		backgroundColor: 'white',
		borderRadius: fr.spacing('2v'),
		padding: fr.spacing('6v')
	},
	actions: {
		display: 'flex',
		justifyContent: 'end',
		alignItems: 'center',
		marginBottom: fr.spacing('5v'),
		'& > div': {
			display: 'flex',
			gap: fr.spacing('10v')
		}
	},
	buttonsGroup: {
		display: 'flex',
		gap: fr.spacing('2v')
	},
	grid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(2, 1fr)',
		gap: fr.spacing('6v')
	}
}));

export default ProcedureComparison;
