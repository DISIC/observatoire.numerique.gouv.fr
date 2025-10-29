import { EmptyScreenZone } from '@/components/generic/EmptyScreenZone';
import { Loader } from '@/components/generic/Loader';
import { fr } from '@codegouvfr/react-dsfr';
import { tss } from 'tss-react';
import IndicatorTabContent from '../IndicatorTabContent';
import { EvolutionViewType } from '@/pages/api/indicator-evolution';
import Button from '@codegouvfr/react-dsfr/Button';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import { useRef, useState } from 'react';
import { useIndicatorEvolution } from '@/utils/api';
import { validIndicatorSlugs } from '@/utils/data-viz-client';
import { exportChartAsImage, exportTableAsCSV } from '@/utils/tools';
import TableView from '../TableView';
import { ProcedureWithFields } from '@/pages/api/procedures/types';

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

	const exportChart = (indicatorLabel: string) => {
		if (dataVisualitionKind === 'table') {
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
								<div className={classes.buttonsGroup}>
									<Button
										iconId="ri-line-chart-line"
										onClick={() => setDataVisualitionKind('line')}
										size="small"
										priority={
											dataVisualitionKind === 'line' ? 'primary' : 'secondary'
										}
										title="Chart"
									>
										Courbe
									</Button>
									<Button
										iconId="ri-table-line"
										onClick={() => setDataVisualitionKind('table')}
										size="small"
										priority={
											dataVisualitionKind === 'table' ? 'primary' : 'secondary'
										}
										title="Table"
									>
										Tableau
									</Button>
								</div>
								<Button
									iconId="ri-download-line"
									priority={'secondary'}
									title={`Exporter en ${
										dataVisualitionKind === 'table' ? 'CSV' : 'PNG'
									}`}
									size="small"
									className={classes.buttonExport}
									onClick={() =>
										exportChart(indicatorData.indicator?.label || '')
									}
								>
									Exporter en {dataVisualitionKind === 'table' ? 'CSV' : 'PNG'}
								</Button>
							</div>
						</div>
						{dataVisualitionKind === 'line' && indicatorSlug !== 'auth' && (
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
					{dataVisualitionKind === 'table' ? (
						<TableView
							headers={[
								{ name: '', description: '' },
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
	buttonsGroup: {
		display: 'flex',
		gap: fr.spacing('2v'),
		marginRight: fr.spacing('6v')
	},
	buttonExport: {
		minWidth: 'max-content'
	}
});

export default DataVizIndicatorEvolution;
