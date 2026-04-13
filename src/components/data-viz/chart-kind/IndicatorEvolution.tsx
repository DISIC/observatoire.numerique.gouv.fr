import { EmptyScreenZone } from '@/components/generic/EmptyScreenZone';
import { Loader } from '@/components/generic/Loader';
import { fr } from '@codegouvfr/react-dsfr';
import { tss } from 'tss-react';
import IndicatorTabContent from '../IndicatorTabContent';
import { EvolutionViewType } from '@/pages/api/indicator-evolution';
import Button from '@codegouvfr/react-dsfr/Button';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import { useRef, useState } from 'react';
import { useIndicatorEvolution } from '@/utils/api';
import { validIndicatorSlugs } from '@/utils/data-viz-client';
import { exportChartAsImage, exportTableAsCSV } from '@/utils/tools';
import TableView from '../TableView';
import { ProcedureWithFields } from '@/pages/api/procedures/types';
import { SegmentedControl } from '@codegouvfr/react-dsfr/SegmentedControl';

const indicatorLegends = [
	{
		slug: 'satisfaction',
		legend:
			'Cette courbe représente l’évolution de l’indicateur “Satisfaction usager” de la démarche.'
	},
	{
		slug: 'handicap',
		legend:
			'Cette courbe représente l’évolution de l’indicateur “Prise en compte du handicap” de la démarche.'
	},
	{
		slug: 'dlnuf',
		legend:
			'Cette courbe représente l’évolution de l’indicateur “Dites-le nous une fois” de la démarche.'
	},
	{
		slug: 'auth'
	},
	{
		slug: 'simplicity',
		legend:
			'Cette courbe représente l’évolution de l’indicateur “Clarté du langage” de la démarche'
	}
];

type DataVizIndicatorEvolutionProps = {
	indicatorSlug: (typeof validIndicatorSlugs)[number];
	procedure?: ProcedureWithFields;
};

const DataVizIndicatorEvolution = ({
	indicatorSlug,
	procedure
}: DataVizIndicatorEvolutionProps) => {
	const { classes, cx } = useStyles();

	const chartRef = useRef<HTMLDivElement>(null);
	const [dataVisualitionKind, setDataVisualitionKind] = useState<
		'line' | 'table'
	>('line');
	const [viewType, setViewType] = useState<EvolutionViewType>('edition');
	const [showCrossScorePerimeter, setShowCrossScorePerimeter] = useState(false);

	const { data: indicatorData } = useIndicatorEvolution({
		view: viewType || 'edition',
		slug: indicatorSlug,
		columnKey: 'title_normalized',
		columnValue: procedure?.title_normalized,
		singleValue: true
	});

	const allValuesInvalid =
		indicatorSlug !== 'auth' &&
		(indicatorData?.groupedData?.every(item => {
			const val = item.values[0]?.value;
			return typeof val !== 'number' || isNaN(val);
		}) ??
			false);

	const effectiveKind = allValuesInvalid ? 'table' : dataVisualitionKind;

	const exportChart = (indicatorLabel: string) => {
		if (effectiveKind === 'table') {
			exportTableAsCSV(
				'table',
				indicatorLabel + '-' + procedure?.title_normalized || ''
			);
		}

		if (chartRef.current && indicatorSlug) {
			exportChartAsImage(chartRef.current, indicatorSlug);
		}
	};

	return (
		<div className={classes.root}>
			{indicatorData ? (
				<div className={classes.content}>
					<div className={classes.tabsHeaderWrapper}>
						<div className={classes.tabsHeaderActionsWrapper}>
							<div className={classes.headingWrapper}>
								<h3 className={fr.cx('fr-mb-0')}>
									<i className={fr.cx(indicatorData.indicator?.icon, 'fr-mr-2v')} />
									{indicatorData.indicator?.label}
								</h3>
								<p className={classes.chartLegend}>
									{
										indicatorLegends.find(
											legend => legend.slug === indicatorSlug
										)?.legend
									}
								</p>
							</div>
							<div className={classes.tabsActions}>
								{!allValuesInvalid && (
									<SegmentedControl
										hideLegend
										legend="Sélection du mode de visualisation des données"
										small
										segments={[
											{
												label: 'Courbe',
												nativeInputProps: {
													checked: dataVisualitionKind === 'line',
													onClick: () => setDataVisualitionKind('line')
												},
												iconId: 'ri-line-chart-line'
											},
											{
												label: 'Tableaux',
												nativeInputProps: {
													checked: dataVisualitionKind === 'table',
													onClick: () => setDataVisualitionKind('table')
												},
												iconId: 'ri-table-line'
											}
										]}
									/>
								)}
								<Button
									iconId="ri-download-line"
									priority={'secondary'}
									title={`Exporter en ${effectiveKind === 'table' ? 'CSV' : 'PNG'
										}`}
									size="small"
									className={classes.buttonExport}
									onClick={() =>
										exportChart(indicatorData.indicator?.label || '')
									}
								>
									Exporter en {effectiveKind === 'table' ? 'CSV' : 'PNG'}
								</Button>
							</div>
						</div>
						{effectiveKind === 'line' && indicatorSlug !== 'auth' && (
							<Checkbox
								options={[
									{
										label: "Moyenne de l'observatoire",
										nativeInputProps: {
											name: 'checkboxes-1',
											value: 'value2',
											onChange: e =>
												setShowCrossScorePerimeter(e.target.checked)
										}
									}
								]}
								orientation="horizontal"
								state="default"
								small
							/>
						)}
					</div>
					{allValuesInvalid && (
						<Alert
							severity="info"
							small
							description="Les valeurs de cet indicateur pour cette démarche ne permettent pas d'afficher un graphique"
							className={fr.cx('fr-mb-3w')}
						/>
					)}
					{effectiveKind === 'table' ? (
						<TableView
							title={`Tableau de l'évolution de l’indicateur ${indicatorData.indicator?.label} pour la démarche ${procedure?.title}`}
							headers={[
								{ name: "Moyenne de l'indicateur", description: '' },
								...(indicatorData.groupedData.map(d => ({
									name: d.name,
									description: ''
								})) || [])
							]}
							rows={[
								{
									title: indicatorData.groupedData[0].values[0].label,
									cells: indicatorData.groupedData.reduce(
										(acc, current) => ({
											...acc,
											[current.name]: current.values[0].valueLabel
										}),
										{}
									)
								}
							]}
						/>
					) : (
						<IndicatorTabContent
							viewType={viewType}
							setViewType={setViewType}
							data={indicatorData}
							field={procedure?.fields.find(f => f.slug === indicatorSlug)}
							chartRef={chartRef}
							chartType="line"
							title={procedure?.title}
							showCrossScorePerimeter={showCrossScorePerimeter}
						/>
					)}
				</div>
			) : (
				<>
					<EmptyScreenZone>
						<Loader loadingMessage="Chargement du contenu en cours..." />
					</EmptyScreenZone>
				</>
			)}
		</div>
	);
};

const useStyles = tss.withName(DataVizIndicatorEvolution.name).create({
	root: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
		['& > div  > h1']: {
			lineHeight: '2.25rem',
			fontSize: '1.75rem'
		}
	},
	content: {
		backgroundColor: 'white',
		border: 'none',
		padding: fr.spacing('6v'),
		borderRadius: fr.spacing('2v')
	},
	tabsHeaderWrapper: {
		marginBottom: fr.spacing('3v')
	},
	tabsHeaderActionsWrapper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: fr.spacing('2v'),
		[fr.breakpoints.down('md')]: {
			flexDirection: 'column-reverse',
			gap: fr.spacing('4v'),
			'& > div': {
				width: '100%',
				justifyContent: 'space-between'
			}
		}
	},
	chartLegend: {
		color: fr.colors.decisions.text.mention.grey.default,
		fontSize: '14px',
		marginBottom: 0
	},
	tabsActions: {
		display: 'flex',
		alignItems: 'center',
		gap: fr.spacing('6v'),
		[fr.breakpoints.down('md')]: {
			flexDirection: 'column',
			gap: fr.spacing('4v'),
			alignItems: 'flex-start'
		}
	},
	headingWrapper: {
		display: 'flex',
		flexDirection: 'column',
		gap: fr.spacing('1v')
	},
	buttonExport: {
		minWidth: 'max-content'
	}
});

export default DataVizIndicatorEvolution;
