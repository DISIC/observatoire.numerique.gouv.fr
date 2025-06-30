import { tss } from 'tss-react';
import { fr } from '@codegouvfr/react-dsfr';
import Tabs from '@codegouvfr/react-dsfr/Tabs';
import { useIndicatorScoreByProcedureKind } from '@/utils/api';
import dynamic from 'next/dynamic';
import Button from '@codegouvfr/react-dsfr/Button';
import DataVizTabHeader from '@/components/data-viz/Header';
import { useState } from 'react';
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb';
import { stringToBase64Url } from '@/utils/tools';
import { ProcedureKind } from '../api/indicator-scores';
import TableView from '@/components/data-viz/TableView';
import { useDebounce } from '@uidotdev/usehooks';

const RadarChartCustom = dynamic(
	() => import('@/components/charts/RadarChart')
);

export type DataVizKind = 'radar' | 'table';

const TabContent = ({
	kind,
	kindLabel
}: {
	kind: ProcedureKind;
	kindLabel: string;
}) => {
	const { classes, cx } = useStyles();

	const [searchTerm, setSearchTerm] = useState<string>();
	const debouncedSearchTerm = useDebounce(searchTerm, 300);

	const { data } = useIndicatorScoreByProcedureKind({
		kind,
		search: debouncedSearchTerm
	});

	const [showGoalRadar, setShowGoalRadar] = useState(false);
	const [showCrossScorePerimeter, setShowCrossScorePerimeter] = useState(false);

	const [dataVisualitionKind, setDataVisualitionKind] = useState<
		'radar' | 'table'
	>('radar');

	return (
		<div>
			<DataVizTabHeader
				kind={kind}
				search={searchTerm}
				setSearch={setSearchTerm}
				dataVisualitionKind={dataVisualitionKind}
				setDataVisualitionKind={setDataVisualitionKind}
				setShowGoalRadar={setShowGoalRadar}
				setShowCrossScorePerimeter={setShowCrossScorePerimeter}
				kindLabel={kindLabel}
				tableId={`table-${kind}`}
			/>

			<TableView
				headers={['', ...(data[0]?.data.map(d => d.name) || [])]}
				rows={data.map(item => ({
					title: item.text,
					cells: item.data.reduce(
						(acc, current) => ({
							...acc,
							[current.slug]: `${current.score}%`
						}),
						{}
					)
				}))}
				hidden={dataVisualitionKind !== 'table'}
				tableId={`table-${kind}`}
			/>
			{dataVisualitionKind === 'radar' && (
				<div className={cx(classes.grid)}>
					{data.map(item => (
						<div key={item.text} className={cx(classes.gridItem)}>
							<div>
								<h2 className={cx(classes.gridTitle, 'fr-text--lg')}>
									{item.text}
								</h2>
								<p className={cx('fr-text--xs')}>
									(Nombre de démarches : {item.count})
								</p>
							</div>
							<div className={cx(classes.chart)}>
								<RadarChartCustom
									data={item.data}
									showGoalRadar={showGoalRadar}
									showCrossScorePerimeter={showCrossScorePerimeter}
								/>
							</div>
							<div className={cx(classes.buttonsGroup)}>
								<Button
									priority="secondary"
									size="small"
									linkProps={{
										href: `/data-viz/${kind}/${stringToBase64Url(
											item.text
										)}/radar-comparison`
									}}
								>
									Comparer
								</Button>
								<Button
									priority="secondary"
									size="small"
									linkProps={{
										href: `/data-viz/${kind}/${stringToBase64Url(
											item.text
										)}/evolution`
									}}
								>
									Voir le détail
								</Button>
								<Button size="small">Voir les démarches</Button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

const DataViz = () => {
	const { classes, cx } = useStyles();
	return (
		<div className={cx(classes.root)}>
			<div className="fr-container">
				<Breadcrumb
					segments={[
						{
							label: 'Accueil',
							linkProps: { href: '/' }
						}
					]}
					currentPageLabel="Dataviz"
					className={cx('fr-mb-1v')}
				/>
				<h1>DataViz</h1>
				<Tabs
					className={classes.tabsWrapper}
					tabs={[
						{
							label: 'Administrations centrales',
							content: (
								<TabContent
									kind="administration_central"
									kindLabel="Administrations centrales"
								/>
							)
						},
						{
							label: 'Périmètres ministériels',
							content: (
								<TabContent
									kind="ministere"
									kindLabel="Périmètres ministériels"
								/>
							)
						},
						{
							label: 'Administrations',
							content: (
								<TabContent kind="administration" kindLabel="Administrations" />
							)
						}
					]}
				/>
			</div>
		</div>
	);
};

const useStyles = tss.withName(DataViz.name).create(() => ({
	root: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
		padding: `${fr.spacing('12v')} 0`,
		['& > div > h1']: {
			...fr.typography[11].style,
			color: fr.colors.decisions.background.actionHigh.blueFrance.default
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
	grid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(3, 1fr)',
		gap: fr.spacing('6v')
	},
	gridItem: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-between',
		textAlign: 'center',
		borderRadius: fr.spacing('2v'),
		padding: `${fr.spacing('3w')} ${fr.spacing('4v')}`,
		border: `1px solid ${fr.colors.decisions.background.contrast.blueFrance.default}`
	},
	gridTitle: {
		fontWeight: 500,
		color: fr.colors.decisions.text.title.grey.default,
		marginBottom: fr.spacing('1v')
	},
	chart: {
		width: '100%',
		height: '325px',
		marginTop: 'auto'
	},
	buttonsGroup: {
		display: 'flex',
		gap: fr.spacing('3v'),
		justifyContent: 'center',
		alignItems: 'center',
		flexWrap: 'wrap',
		marginTop: fr.spacing('2v')
	},
	modal: {
		textAlign: 'start'
	}
}));

export default DataViz;
