import TableView from '@/components/data-viz/TableView';
import { IndicatorLabel } from '@/components/top250/table/IndicatorLabel';
import { ProcedureKind } from '@/pages/api/indicator-scores';
import { useProcedures } from '@/utils/api';
import {
	isValidIndicatorSlug,
	validIndicatorSlugs
} from '@/utils/data-viz-client';
import {
	base64UrlToString,
	exportTableAsCSV,
	getProcedureKindLabel,
	stringToBase64Url
} from '@/utils/tools';
import { trpc } from '@/utils/trpc';
import { fr } from '@codegouvfr/react-dsfr';
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb';
import Button from '@codegouvfr/react-dsfr/Button';
import SearchBar from '@codegouvfr/react-dsfr/SearchBar';
import assert from 'assert';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { tss } from 'tss-react';

const DataVizProcedures = () => {
	const router = useRouter();
	const { kind, slug: tmpSlug } = router.query as {
		kind: ProcedureKind;
		slug: string;
	};
	const slug = tmpSlug ? base64UrlToString(tmpSlug) : '';

	const [dataVisualitionKind, setDataVisualitionKind] = useState<
		'list' | 'table'
	>('list');
	const [search, setSearch] = useState<string>();

	const { classes, cx } = useStyles();

	const [inputElement, setInputElement] = useState<HTMLInputElement | null>(
		null
	);

	const kindKey = kind !== 'ministere' ? kind : 'department';

	const { data: procdeureHeadersRequest, isLoading: isLoadingIndicators } =
		trpc.indicators.getList.useQuery({
			page: 1,
			perPage: 100
		});
	const indicators =
		procdeureHeadersRequest?.data.filter(indicator =>
			isValidIndicatorSlug(indicator.slug)
		) || [];

	const { data, isError, isLoading } = useProcedures({
		search,
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

	if (isError) return <div>Une erreur est survenue.</div>;

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
						}
					]}
					currentPageLabel={`Démarches du périmètre ${slug}`}
					className={cx('fr-mb-1v')}
				/>
				<h1>Démarches du périmètre {slug}</h1>
				<div className={classes.pageContent}>
					<div className={cx(classes.wrapperSearch)}>
						<SearchBar
							label="Rechercher"
							className={cx(classes.searchInput)}
							renderInput={({ className, id, type }) => (
								<input
									ref={setInputElement}
									className={className}
									id={id}
									placeholder={`Rechercher une démarche`}
									type={type}
									value={search}
									onChange={event => setSearch(event.currentTarget.value)}
									onKeyDown={event => {
										if (event.key === 'Escape' && inputElement !== null) {
											assert(inputElement !== null);
											inputElement.blur();
										}
									}}
								/>
							)}
						/>
						<div className={classes.tabsActions}>
							<div className={cx(classes.buttonsGroup)}>
								<Button
									iconId="ri-list-unordered"
									onClick={() => setDataVisualitionKind('list')}
									priority={
										dataVisualitionKind === 'list' ? 'primary' : 'secondary'
									}
									title="Radar"
								/>
								<Button
									iconId="ri-table-line"
									onClick={() => setDataVisualitionKind('table')}
									priority={
										dataVisualitionKind === 'table' ? 'primary' : 'secondary'
									}
									title="Table"
								/>
							</div>
							<Button
								iconId="ri-download-line"
								priority={'secondary'}
								title="Exporter"
								onClick={() => {
									exportTableAsCSV(`table`, `demarches-${slug}`);
								}}
							>
								Exporter
							</Button>
						</div>
					</div>
					{isLoading || !procedures ? (
						<div className={cx(classes.loader)}>
							<div>
								<i className={fr.cx('ri-loader-4-line')} />
							</div>

							<p className={fr.cx('fr-pt-4v')}>Recherche en cours...</p>
						</div>
					) : (
						<>
							<TableView
								headers={[
									'Démarches',
									...(procedures[0]?.fields.map(
										d =>
											indicators.find(i => i.slug === d.slug)?.label || d.slug
									) || [])
								]}
								rows={procedures.map(item => ({
									title: item.title,
									cells: item.fields.reduce((acc, current) => {
										const finalLabel =
											current.label.includes('Partiel') && current.value
												? current.label + ` - ${current.value}%`
												: current.label;
										return {
											...acc,
											[current.slug]: finalLabel
										};
									}, {})
								}))}
								hidden={dataVisualitionKind !== 'table'}
							/>
							{dataVisualitionKind === 'list' && (
								<div className={cx(classes.grid)}>
									{procedures?.map(item => (
										<div key={item.id} className={cx(classes.gridItem)}>
											<div>
												<h2 className={cx(classes.gridTitle, 'fr-text--lg')}>
													{item.title}
												</h2>
												<p className={cx('fr-text--xs', 'fr-mb-0')}>
													{item.administration}
												</p>
											</div>
											<div className={cx(classes.procredureStats)}>
												{indicators.map((indicator, index) => {
													const field = item.fields.find(
														f => f.slug === indicator.slug
													);

													if (!field) return null;

													return (
														<div
															key={`${item.id}-${indicator.id}`}
															className={classes.indicator}
															style={{
																backgroundColor:
																	index % 2
																		? fr.colors.decisions.artwork.background
																				.blueFrance.default
																		: 'transparent'
															}}
														>
															<div className={classes.indicatorLabelContainer}>
																<i
																	className={cx(
																		fr.cx(indicator.icon, 'fr-mr-2v')
																	)}
																/>
																<span className={classes.indicatorLabel}>
																	{indicator.label}
																</span>
															</div>
															<IndicatorLabel {...field} />
														</div>
													);
												})}
											</div>
											<div className={cx(classes.buttonsGroup)}>
												<Button
													priority="secondary"
													size="small"
													linkProps={{
														href: `/data-viz/${kind}/${tmpSlug}/radar-comparison`
													}}
												>
													Comparer
												</Button>
												<Button
													priority="secondary"
													size="small"
													linkProps={{
														href: `/data-viz/${kind}/${tmpSlug}/evolution`
													}}
												>
													Voir le détail
												</Button>
											</div>
										</div>
									))}
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

const useStyles = tss.create({
	root: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
		padding: `${fr.spacing('8v')} 0`,
		['& > div  > h1']: {
			lineHeight: '2.25rem',
			fontSize: '1.75rem'
		}
	},
	loader: {
		padding: fr.spacing('30v'),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		i: {
			display: 'inline-block',
			animation: 'spin 1s linear infinite;',
			color: fr.colors.decisions.background.actionHigh.blueFrance.default,
			['&::before']: {
				'--icon-size': '2rem'
			}
		}
	},
	pageContent: {
		backgroundColor: 'white',
		borderRadius: fr.spacing('2v'),
		padding: fr.spacing('6v')
	},
	wrapperSearch: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: fr.spacing('6v')
	},
	searchInput: {
		width: '35%'
	},
	tabsActions: {
		display: 'flex',
		alignItems: 'center',
		gap: fr.spacing('8v')
	},
	buttonsGroup: {
		display: 'flex',
		gap: fr.spacing('2v')
	},
	grid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(2, 1fr)',
		gap: fr.spacing('6v')
	},
	gridItem: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-between',
		textAlign: 'center',
		gap: fr.spacing('5v'),
		borderRadius: fr.spacing('2v'),
		padding: `${fr.spacing('3w')} ${fr.spacing('4v')}`,
		border: `1px solid ${fr.colors.decisions.background.contrast.blueFrance.default}`
	},
	gridTitle: {
		fontWeight: 500,
		color: fr.colors.decisions.text.title.grey.default,
		marginBottom: fr.spacing('1v')
	},
	procredureStats: {
		...fr.spacing('padding', { rightLeft: '4v' }),
		border: `1px solid ${fr.colors.decisions.background.contrast.blueFrance.default}`,
		borderRadius: fr.spacing('2v'),
		width: '100%',
		marginTop: 'auto'
	},
	indicator: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: fr.spacing('4v'),
		borderRadius: fr.spacing('3v'),
		width: '100%',
		'i::before, i::after ': {
			'--icon-size': '1.25rem',
			color: fr.colors.decisions.text.title.blueFrance.default
		}
	},
	indicatorLabelContainer: {
		alignItems: 'center'
	},
	indicatorLabel: {
		fontWeight: 500,
		fontSize: '0.875rem',
		lineHeight: '1.5rem'
	}
});

export default DataVizProcedures;
