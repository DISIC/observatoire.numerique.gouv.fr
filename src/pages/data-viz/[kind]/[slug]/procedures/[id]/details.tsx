import IndicatorTabContent from '@/components/data-viz/IndicatorTabContent';
import { EmptyScreenZone } from '@/components/generic/EmptyScreenZone';
import { Loader } from '@/components/generic/Loader';
import { EvolutionViewType } from '@/pages/api/indicator-evolution';
import { ProcedureKind } from '@/pages/api/indicator-scores';
import { useIndicatorEvolution, useProcedureById } from '@/utils/api';
import { validIndicatorSlugs } from '@/utils/data-viz-client';
import {
	base64UrlToString,
	exportChartAsImage,
	exportTableAsCSV
} from '@/utils/tools';
import { fr } from '@codegouvfr/react-dsfr';
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb';
import Button from '@codegouvfr/react-dsfr/Button';
import Tabs from '@codegouvfr/react-dsfr/Tabs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { tss } from 'tss-react';

const ProcedureDetails = () => {
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
		'line' | 'table'
	>('line');

	const [selectedTabId, setSelectedTabId] =
		useState<(typeof validIndicatorSlugs)[number]>('satisfaction');

	const [viewType, setViewType] = useState<EvolutionViewType>('edition');

	const { classes, cx } = useStyles();

	const chartRef = useRef<HTMLDivElement>(null);

	const { data: procedure, isError, isLoading } = useProcedureById(id);

	const { data: indicatorData } = useIndicatorEvolution({
		view: viewType || 'edition',
		slug: selectedTabId,
		columnKey: 'title_normalized',
		columnValue: procedure?.title_normalized,
		singleValue: true
	});

	const tabs = [
		{
			tabId: 'satisfaction',
			label: (
				<span>
					<i className="ri-emoji-sticker-line" />{' '}
					{selectedTabId === 'satisfaction' && <span>Satisfaction usager</span>}
				</span>
			),
			legend:
				'Cette courbe représente l’évolution de l’indicateur “Satisfaction usager” de la démarche.'
		},
		{
			tabId: 'handicap',
			label: (
				<span>
					<i className="ri-open-arm-line" />{' '}
					{selectedTabId === 'handicap' && (
						<span>Prise en compte du handicap</span>
					)}
				</span>
			),
			legend:
				'Cette courbe représente l’évolution de l’indicateur “Prise en compte du handicap” de la démarche.'
		},
		{
			tabId: 'dlnuf',
			label: (
				<span>
					<i className="ri-pass-valid-line" />{' '}
					{selectedTabId === 'dlnuf' && <span>Dites-le-nous une fois</span>}
				</span>
			),
			legend:
				'Cette courbe représente l’évolution de l’indicateur “Dites-le nous une fois” de la démarche.'
		},
		{
			tabId: 'auth',
			label: (
				<span>
					<i className="ri-lock-unlock-line" />{' '}
					{selectedTabId === 'auth' && <span>Authentification</span>}
				</span>
			)
		},
		{
			tabId: 'simplicity',
			label: (
				<span>
					<i className="ri-speak-line" />{' '}
					{selectedTabId === 'simplicity' && <span>Clarté du langage</span>}
				</span>
			),
			legend:
				'Cette courbe représente l’évolution de l’indicateur “Clarté du langage” de la démarche'
		}
	];

	const getPercentage = (value: number, total: number) => {
		if (total === 0) return 0;
		return Math.round(Math.round((value / total) * 10000) / 100);
	};

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
					currentPageLabel={`Détail des indicateurs de la démarche ${procedure?.title}`}
					className={cx('fr-mb-1v')}
				/>
				<h1>Détail des indicateurs de la démarche {procedure?.title}</h1>
				<Tabs
					className={classes.tabsWrapper}
					selectedTabId={selectedTabId}
					onTabChange={tabId =>
						setSelectedTabId(tabId as (typeof validIndicatorSlugs)[number])
					}
					tabs={tabs.map(tab => ({
						...tab
					}))}
				>
					{indicatorData ? (
						<>
							{slug === 'auth' && (
								<div className={classes.tabsHeaderWrapper}>
									<p className={classes.chartLegend}>
										{tabs.find(tab => tab.tabId === selectedTabId)?.legend}
									</p>
									<div className={classes.tabsActions}>
										<div className={classes.buttonsGroup}>
											<Button
												iconId="ri-line-chart-line"
												onClick={() => setDataVisualitionKind('line')}
												priority={
													dataVisualitionKind === 'line'
														? 'primary'
														: 'secondary'
												}
												title="Chart"
											/>
											<Button
												iconId="ri-table-line"
												onClick={() => setDataVisualitionKind('table')}
												priority={
													dataVisualitionKind === 'table'
														? 'primary'
														: 'secondary'
												}
												title="Table"
											/>
										</div>
										<Button
											iconId="ri-download-line"
											priority={'secondary'}
											title="Exporter"
											onClick={() => {
												if (dataVisualitionKind === 'table') {
													exportTableAsCSV('table', slug);
												}

												if (chartRef.current && slug) {
													exportChartAsImage(chartRef.current, slug);
												}
											}}
										>
											Exporter
										</Button>
									</div>
								</div>
							)}
							{dataVisualitionKind === 'table' ? (
								// <TableView
								// 	headers={['', ...(apiData.map(d => d.name) || [])]}
								// 	rows={getRows()}
								// />
								<></>
							) : (
								<IndicatorTabContent
									shouldShowCrossScorePerimeter
									setViewType={setViewType}
									data={indicatorData}
									field={procedure?.fields.find(f => f.slug === selectedTabId)}
									chartRef={chartRef}
									chartType="line"
								/>
							)}
						</>
					) : (
						<>
							{isLoading && (
								<EmptyScreenZone>
									<Loader loadingMessage="Chargement du contenu en cours..." />
								</EmptyScreenZone>
							)}
						</>
					)}
					<div className={classes.linkContainer}>
						<Link
							href="/Aide/Observatoire?tab=indicators"
							className={fr.cx('fr-link')}
						>
							Tout comprendre sur les indicateurs{' '}
							<i className={fr.cx('fr-icon-external-link-line', 'fr-ml-1v')} />
						</Link>
					</div>
				</Tabs>
			</div>
		</div>
	);
};

const useStyles = tss.withName(ProcedureDetails.name).create({
	root: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
		padding: `${fr.spacing('8v')} 0`,
		['& > div  > h1']: {
			lineHeight: '2.25rem',
			fontSize: '1.75rem'
		}
	},
	tabsWrapper: {
		boxShadow: 'none',
		border: 'none',
		'&::before': {
			boxShadow: 'none'
		},
		['& > .fr-tabs__list']: {
			marginBottom: fr.spacing('1v')
		},
		['& > .fr-tabs__panel']: {
			backgroundColor: 'white',
			border: 'none',
			padding: fr.spacing('6v'),
			borderRadius: fr.spacing('2v')
		}
	},
	tabsHeaderWrapper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: fr.spacing('6v'),
		[fr.breakpoints.down('md')]: {
			flexDirection: 'column-reverse',
			gap: fr.spacing('4v')
		}
	},
	chartLegend: {
		color: fr.colors.decisions.text.mention.grey.default,
		fontSize: '14px',
		marginBottom: 0
	},
	tabsActions: {
		display: 'flex',
		alignItems: 'center'
	},
	buttonsGroup: {
		display: 'flex',
		gap: fr.spacing('2v'),
		marginRight: fr.spacing('8v')
	},
	linkContainer: {
		width: '100%',
		display: 'flex',
		justifyContent: 'flex-end',
		marginTop: fr.spacing('6v'),
		a: {
			fontSize: '14px',
			'i::after, i::before': {
				'--icon-size': '14px'
			}
		}
	}
});

export default ProcedureDetails;
