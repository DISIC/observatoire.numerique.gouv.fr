import TableView from '@/components/data-viz/TableView';
import { LightSelect } from '@/components/generic/LightSelect';
import {
	EvolutionViewType,
	RecordDataGrouped
} from '@/pages/api/indicator-evolution';
import { ProcedureKind } from '@/pages/api/indicator-scores';
import { useIndicatorEvolution } from '@/utils/api';
import { validIndicatorSlugs } from '@/utils/data-viz';
import { base64UrlToString, exportChartAsImage } from '@/utils/tools';
import { fr } from '@codegouvfr/react-dsfr';
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb';
import Button from '@codegouvfr/react-dsfr/Button';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import Tabs from '@codegouvfr/react-dsfr/Tabs';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useId, useRef, useState } from 'react';
import { tss } from 'tss-react';

const BarChartCustom = dynamic(() => import('@/components/charts/BarChart'));

type TabContentProps = {
	procedureKind: ProcedureKind;
	indicatorSlug: string;
	shouldShowGoalLine?: boolean;
	shouldShowCrossScorePerimeter?: boolean;
	setViewType: (viewType: EvolutionViewType) => void;
	data: RecordDataGrouped[];
	chartRef: React.RefObject<HTMLDivElement | null>;
};

const TabContent = ({
	procedureKind,
	indicatorSlug,
	shouldShowGoalLine,
	shouldShowCrossScorePerimeter,
	data,
	setViewType,
	chartRef
}: TabContentProps) => {
	const { classes, cx } = useStyles();

	const [showGoalLine, setShowGoalLine] = useState(false);
	const [showCrossScorePerimeter, setShowCrossScorePerimeter] = useState(false);

	return (
		<div className={classes.tabContent}>
			{(shouldShowGoalLine || shouldShowCrossScorePerimeter) && (
				<div style={{ display: 'flex', alignItems: 'center' }}>
					{shouldShowGoalLine && (
						<Checkbox
							options={[
								{
									label: 'Objectif',
									nativeInputProps: {
										name: 'checkboxes-1',
										value: 'value1',
										onChange: e => setShowGoalLine(e.target.checked)
									}
								}
							]}
							orientation="horizontal"
							state="default"
							small
						/>
					)}
					{shouldShowCrossScorePerimeter && (
						<Checkbox
							options={[
								{
									label: 'Moyenne inter-périmètre',
									nativeInputProps: {
										name: 'checkboxes-1',
										value: 'value2',
										onChange: e => setShowCrossScorePerimeter(e.target.checked)
									}
								}
							]}
							orientation="horizontal"
							state="default"
							small
						/>
					)}
				</div>
			)}

			<div className={cx(classes.chart)} ref={chartRef}>
				<BarChartCustom
					dataKeys={
						data[0]?.values.map(value => ({
							label: value.label,
							color: value.color,
							position: value.position
						})) || []
					}
					data={data}
				/>
			</div>
			<div className={classes.viewTypeContainer}>
				<LightSelect
					label=""
					id="select-view"
					options={[
						{
							label: 'Éditions',
							value: 'edition'
						},
						{
							label: 'Années',
							value: 'year'
						}
					]}
					defaultValue={'edition'}
					size="small"
					onChange={value => setViewType(value as EvolutionViewType)}
					className={classes.selectViewType}
				/>
			</div>
		</div>
	);
};

function DataVizEvolution() {
	const router = useRouter();
	const { kind, slug: tmpSlug } = router.query as {
		kind: ProcedureKind;
		slug: string;
	};
	const slug = tmpSlug ? base64UrlToString(tmpSlug) : '';

	const [dataVisualitionKind, setDataVisualitionKind] = useState<
		'line' | 'table'
	>('line');

	const [selectedTabId, setSelectedTabId] =
		useState<(typeof validIndicatorSlugs)[number]>('satisfaction');

	const [viewType, setViewType] = useState<EvolutionViewType>('edition');

	const { classes, cx } = useStyles();

	const id = useId();
	const chartRef = useRef<HTMLDivElement>(null);

	const { data: apiData } = useIndicatorEvolution({
		view: viewType || 'edition',
		slug: selectedTabId,
		kind,
		value: slug
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
				'Cet histogramme représente la répartition en pourcentage des niveaux de satisfactions des démarches du périmètre ministériel.'
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
				'Cet histogramme représente la répartition en pourcentage du niveau d’accessibilité numérique des démarches du périmètre ministériel.'
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
				'Cet histogramme représente la répartition en pourcentage du niveau de simplification des démarches du périmètre ministériel.'
		},
		{
			tabId: 'auth',
			label: (
				<span>
					<i className="ri-lock-unlock-line" />{' '}
					{selectedTabId === 'auth' && <span>Authentification</span>}
				</span>
			),
			legend:
				'Cet histogramme représente la répartition en pourcentage des démarches de l’indicateur “Authentification”'
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
				'Cet histogramme représente la répartition en pourcentage des niveaux de clarté des démarches du périmètre ministériel.'
		}
	];

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
					currentPageLabel={`Détail des indicateurs du périmètre ${slug}`}
					className={cx('fr-mb-1v')}
				/>
				<h1>Détail des indicateurs du périmètre {slug}</h1>
				<div>
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
						<div className={classes.tabsHeaderWrapper}>
							<p className={classes.chartLegend}>
								{tabs.find(tab => tab.tabId === selectedTabId)?.legend}
							</p>
							<div className={classes.tabsActions}>
								<div className={classes.buttonsGroup}>
									<Button
										iconId="ri-bar-chart-line"
										onClick={() => setDataVisualitionKind('line')}
										priority={
											dataVisualitionKind === 'line' ? 'primary' : 'secondary'
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
									/>
								</div>
								<Button
									iconId="ri-download-line"
									priority={'secondary'}
									title="Exporter"
									onClick={() => {
										if (chartRef.current && slug) {
											exportChartAsImage(chartRef.current, slug);
										}
									}}
								>
									Exporter
								</Button>
							</div>
						</div>
						{dataVisualitionKind === 'table' ? (
							<TableView
								headers={['', ...(apiData.map(d => d.name) || [])]}
								rows={apiData[0]?.values.map(value => ({
									title: value.label,
									cells: apiData.reduce((acc, current) => {
										return {
											...acc,
											[current.name]:
												Math.round(
													(current.values.find(
														v => v.position === value.position
													)?.value ?? 0) * 100
												) /
													100 +
												`%`
										};
									}, {})
								}))}
							/>
						) : (
							<TabContent
								procedureKind={kind}
								indicatorSlug={selectedTabId}
								shouldShowGoalLine={
									false
									// openState?.dialogParams.shouldShowGoalLine
								}
								shouldShowCrossScorePerimeter={
									false
									// openState?.dialogParams.shouldShowCrossScorePerimeter
								}
								setViewType={setViewType}
								data={apiData}
								chartRef={chartRef}
							/>
						)}
						<div className={classes.linkContainer}>
							<Link
								href="/Aide/Observatoire?tab=indicators"
								className={fr.cx('fr-link')}
							>
								Tout comprendre sur les indicateurs{' '}
								<i
									className={fr.cx('fr-icon-external-link-line', 'fr-ml-1v')}
								/>
							</Link>
						</div>
					</Tabs>
				</div>
			</div>
		</div>
	);
}

const useStyles = tss.withName(DataVizEvolution.name).create(() => ({
	root: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
		padding: `${fr.spacing('12v')} 0`,
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
	tabsActions: {
		display: 'flex',
		alignItems: 'center'
	},
	buttonsGroup: {
		display: 'flex',
		gap: fr.spacing('2v'),
		marginRight: fr.spacing('8v')
	},
	tabContent: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		borderRadius: fr.spacing('2v'),
		padding: `${fr.spacing('3w')} ${fr.spacing('4v')}`,
		border: `1px solid ${fr.colors.decisions.background.contrast.blueFrance.default}`
	},
	chart: {
		width: '100%',
		height: '500px'
	},
	chartLegend: {
		color: fr.colors.decisions.text.mention.grey.default,
		fontSize: '14px',
		marginBottom: 0
	},
	viewTypeContainer: {
		width: '100%',
		display: 'flex',
		justifyContent: 'flex-end'
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
	},
	selectViewType: {
		['select.fr-select']: {
			width: '100%'
		},
		width: '7rem'
	}
}));

export default DataVizEvolution;
