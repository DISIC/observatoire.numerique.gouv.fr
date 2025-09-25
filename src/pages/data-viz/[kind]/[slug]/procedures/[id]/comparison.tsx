import ProcedureIndicatorsGridItem from '@/components/data-viz/ProcedureIndicatorsGridItem';
import TableView, { TableViewProps } from '@/components/data-viz/TableView';
import { EmptyScreenZone } from '@/components/generic/EmptyScreenZone';
import { Loader } from '@/components/generic/Loader';
import { ProcedureKind } from '@/pages/api/indicator-scores';
import { useProcedureById, useProcedures } from '@/utils/api';
import { isValidIndicatorSlug } from '@/utils/data-viz-client';
import { base64UrlToString, exportTableAsCSV } from '@/utils/tools';
import { trpc } from '@/utils/trpc';
import { fr } from '@codegouvfr/react-dsfr';
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb';
import Button from '@codegouvfr/react-dsfr/Button';
import Select from '@codegouvfr/react-dsfr/Select';
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
	const [selectedProcedureId, setSelectedProcedureId] = useState<string>('');

	const { data: procedure, isLoading } = useProcedureById(id);
	const { data: comparedProcedure, isLoading: isLoadingCompared } =
		useProcedureById(selectedProcedureId);

	const { data: procdeureHeadersRequest, isLoading: isLoadingIndicators } =
		trpc.indicators.getList.useQuery({
			page: 1,
			perPage: 100
		});

	const indicators =
		procdeureHeadersRequest?.data.filter(indicator =>
			isValidIndicatorSlug(indicator.slug)
		) || [];

	const kindKey = kind !== 'ministere' ? kind : 'department';

	const { data, isLoading: isLoadingProcedures } = useProcedures({
		[kindKey]: slug
	});

	const procedures = data?.map(procedure => {
		const fields = procedure.fields.filter(field =>
			isValidIndicatorSlug(field.slug)
		);
		return {
			...procedure,
			fields
		};
	});

	const getRows = (): TableViewProps['rows'] => {
		if (!indicators || !procedure || !comparedProcedure) return [];
		return [
			{
				title: procedure.title,
				cells: indicators.reduce((acc, indicator) => {
					const field = procedure.fields.find(f => f.slug === indicator.slug);
					let finalLabel = '-';
					if (field) {
						finalLabel =
							field.label.includes('Partiel') && field.value
								? field.label + ` - ${field.value}%`
								: field.label;
					}
					return {
						...acc,
						[indicator.slug]: finalLabel
					};
				}, {})
			},
			{
				title: comparedProcedure.title,
				cells: indicators.reduce((acc, indicator) => {
					const field = comparedProcedure.fields.find(
						f => f.slug === indicator.slug
					);
					let finalLabel = '-';
					if (field) {
						finalLabel =
							field.label.includes('Partiel') && field.value
								? field.label + ` - ${field.value}%`
								: field.label;
					}
					return {
						...acc,
						[indicator.slug]: finalLabel
					};
				}, {})
			}
		];
	};

	const headers = getRows()[0] && Object.keys(getRows()[0].cells);

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
									disabled={selectedProcedureId === ''}
								/>
							</div>
							<Button
								iconId="ri-download-line"
								priority={'secondary'}
								title="Exporter"
								onClick={() => {
									if (!procedure) return;
									exportTableAsCSV(`table`, procedure.title);
								}}
								disabled={!procedure || !comparedProcedure}
							>
								Exporter
							</Button>
						</div>
					</div>

					<TableView
						headers={[
							'',
							...(headers?.map(
								h => indicators.find(i => i.slug === h)?.label || ''
							) || [])
						]}
						rows={getRows()}
						hidden={dataVisualitionKind !== 'table'}
					/>

					{!isLoading &&
					!isLoadingProcedures &&
					!isLoadingIndicators &&
					procedure ? (
						dataVisualitionKind === 'list' && (
							<div className={cx(classes.grid)}>
								<ProcedureIndicatorsGridItem
									procedure={procedure}
									indicators={indicators}
									showCompareButton={false}
								/>
								{!isLoadingCompared && comparedProcedure ? (
									<ProcedureIndicatorsGridItem
										procedure={comparedProcedure}
										indicators={indicators}
										showCompareButton={false}
										onClose={() => setSelectedProcedureId('')}
									/>
								) : (
									<div className={cx(classes.gridItem)}>
										<Select
											label="Démarche"
											nativeSelectProps={{
												id: `select-kind-${id}`,
												onChange: event =>
													setSelectedProcedureId(event.target.value),
												value: selectedProcedureId
											}}
										>
											<option value="" disabled>
												Sélectionner une option
											</option>
											{procedures
												?.filter(option => option.id !== id)
												.map(option => (
													<option key={option.id} value={option.id}>
														{option.title}
													</option>
												))}
										</Select>
										<div className={classes.emptyStateContainer}>
											<p>Ajouter une démarche à comparer</p>
										</div>
									</div>
								)}
							</div>
						)
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
			gap: fr.spacing('10v'),
			[fr.breakpoints.down('md')]: {
				width: '100%',
				justifyContent: 'space-between'
			}
		}
	},
	buttonsGroup: {
		display: 'flex',
		gap: fr.spacing('2v')
	},
	grid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(2, 1fr)',
		gap: fr.spacing('6v'),
		[fr.breakpoints.down('md')]: {
			gridTemplateColumns: '1fr',
			'& > :first-of-type': { order: 2 }
		}
	},
	gridItem: {
		display: 'flex',
		flexDirection: 'column',
		borderRadius: fr.spacing('2v'),
		padding: `${fr.spacing('3w')} ${fr.spacing('4v')}`,
		border: `1px solid ${fr.colors.decisions.background.contrast.blueFrance.default}`
	},
	emptyStateContainer: {
		width: '100%',
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		textAlign: 'center',
		p: {
			fontWeight: 500,
			color: fr.colors.decisions.text.title.blueFrance.default,
			fontSize: '1.125rem'
		}
	}
}));

export default ProcedureComparison;
