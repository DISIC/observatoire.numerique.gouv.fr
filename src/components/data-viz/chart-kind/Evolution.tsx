import IndicatorTabContent from '@/components/data-viz/IndicatorTabContent';
import TableView, { TableViewProps } from '@/components/data-viz/TableView';
import { EmptyScreenZone } from '@/components/generic/EmptyScreenZone';
import { Loader } from '@/components/generic/Loader';
import { EvolutionViewType } from '@/pages/api/indicator-evolution';
import { ProcedureKind } from '@/pages/api/indicator-scores';
import { useIndicatorEvolution } from '@/utils/api';
import { validIndicatorSlugs } from '@/utils/data-viz-client';
import {
	exportChartAsImage,
	exportTableAsCSV,
	getValidIndicatorLabel
} from '@/utils/tools';
import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import { useRef, useState } from 'react';
import { tss } from 'tss-react';

type EvolutionProps = {
	kind: ProcedureKind;
	slug: string;
	indicator: (typeof validIndicatorSlugs)[number];
	legend: string;
};

function DataVizEvolution({ kind, slug, indicator, legend }: EvolutionProps) {
	const [dataVisualitionKind, setDataVisualitionKind] = useState<
		'line' | 'table'
	>('line');

	const [viewType, setViewType] = useState<EvolutionViewType>('edition');

	const { classes, cx } = useStyles();

	const chartRef = useRef<HTMLDivElement>(null);

	const { data: apiData, isLoading } = useIndicatorEvolution({
		view: viewType || 'edition',
		slug: indicator,
		columnKey: kind,
		columnValue: slug
	});

	const exportChart = () => {
		if (dataVisualitionKind === 'table') {
			exportTableAsCSV('table', slug);
		} else if (chartRef.current && slug) {
			const matches = slug.match(/\b([A-Z])/g) ?? [];
			const titleChart = matches.join('');
			exportChartAsImage(chartRef.current, `${titleChart}-${indicator}`);
		}
	};

	const getPercentage = (value: number, total: number) => {
		if (total === 0) return 0;
		return Math.round(Math.round((value / total) * 10000) / 100);
	};

	const getRows = (): TableViewProps['rows'] => {
		if (!apiData || apiData.groupedData.length === 0) return [];

		return apiData.groupedData[0]?.values
			.sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
			.map(value => ({
				title: value.label,
				description: value.description,
				cells: apiData.groupedData.reduce((acc, current) => {
					const total = current.values.reduce((sum, v) => sum + v.value, 0);
					return {
						...acc,
						[current.name]:
							getPercentage(
								current.values.find(v => v.position === value.position)
									?.value ?? 0,
								total
							) + `%`
					};
				}, {} as Record<string, string>)
			}));
	};

	return (
		<div className={cx(classes.root)}>
			<div>
				{apiData ? (
					<div className={classes.indicatorTabContent}>
						<div className={classes.headerWrapper}>
							<div className={classes.headingWrapper}>
								<h3 className={fr.cx('fr-mb-0')}>
									{getValidIndicatorLabel(indicator)}
								</h3>
								<p className={classes.chartLegend}>{legend}</p>
							</div>
							<div className={classes.tabsActions}>
								<div className={classes.buttonsGroup}>
									<Button
										iconId="ri-bar-chart-line"
										onClick={() => setDataVisualitionKind('line')}
										size="small"
										priority={
											dataVisualitionKind === 'line' ? 'primary' : 'secondary'
										}
									>
										Graphique
									</Button>
									<Button
										iconId="ri-table-line"
										onClick={() => setDataVisualitionKind('table')}
										size="small"
										priority={
											dataVisualitionKind === 'table' ? 'primary' : 'secondary'
										}
									>
										Tableau
									</Button>
								</div>
								<Button
									iconId="ri-download-line"
									priority="secondary"
									title={`Exporter en ${
										dataVisualitionKind === 'table' ? 'CSV' : 'PNG'
									}`}
									size="small"
									className={classes.buttonExport}
									onClick={exportChart}
								>
									Exporter en {dataVisualitionKind === 'table' ? 'CSV' : 'PNG'}
								</Button>
							</div>
						</div>
						{dataVisualitionKind === 'table' ? (
							<TableView
								headers={[
									{ name: '', description: '' },
									...(apiData?.groupedData.map(d => ({
										name: d.name,
										description: ''
									})) || [])
								]}
								rows={getRows()}
							/>
						) : (
							<IndicatorTabContent
								viewType={viewType}
								setViewType={setViewType}
								data={apiData}
								chartRef={chartRef}
							/>
						)}
					</div>
				) : (
					<>
						{isLoading && (
							<EmptyScreenZone>
								<Loader loadingMessage="Chargement du contenu en cours..." />
							</EmptyScreenZone>
						)}
					</>
				)}
			</div>
		</div>
	);
}

const useStyles = tss.withName(DataVizEvolution.name).create(() => ({
	root: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
		['& > div  > h1']: {
			lineHeight: '2.25rem',
			fontSize: '1.75rem'
		}
	},
	headerWrapper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: fr.spacing('6v'),
		gap: fr.spacing('10v'),
		[fr.breakpoints.down('md')]: {
			flexDirection: 'column',
			gap: fr.spacing('4v'),
			'& > div': {
				width: '100%',
				justifyContent: 'space-between'
			}
		}
	},
	headingWrapper: {
		display: 'flex',
		flexDirection: 'column',
		gap: fr.spacing('1v')
	},
	indicatorTabContent: {
		backgroundColor: 'white',
		border: 'none',
		padding: fr.spacing('6v'),
		borderRadius: fr.spacing('2v')
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
	buttonsGroup: {
		display: 'flex',
		gap: fr.spacing('2v'),
		marginRight: fr.spacing('6v')
	},
	buttonExport: {
		minWidth: 'max-content'
	},
	chartLegend: {
		color: fr.colors.decisions.text.mention.grey.default,
		fontSize: '14px',
		marginBottom: 0
	}
}));

export default DataVizEvolution;
