import { tss } from 'tss-react';
import { fr } from '@codegouvfr/react-dsfr';
import Tabs from '@codegouvfr/react-dsfr/Tabs';
import { useIndicatorScoreByProcedureKind } from '@/utils/api';
import dynamic from 'next/dynamic';
import Button from '@codegouvfr/react-dsfr/Button';
import DataVizTabHeader from '@/components/data-viz/Header';
import { useState } from 'react';
import { ProcedureKind } from './api/indicator-scores';
import {
	ModalEvolutionParams,
	ModalEvolution
} from '@/components/data-viz/ModalEvolution';
import {
	ModalComparison,
	ModalComparisonParams
} from '@/components/data-viz/ModalComparison';

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
	const { data } = useIndicatorScoreByProcedureKind({ kind });

	const [showGoalRadar, setShowGoalRadar] = useState(false);
	const [showCrossScorePerimeter, setShowCrossScorePerimeter] = useState(false);

	const [dataVisualitionKind, setDataVisualitionKind] = useState<
		'radar' | 'table'
	>('radar');

	const [modalEvolutionActions] = useState<{
		open?: (params: ModalEvolutionParams) => void;
	}>({});

	const [modalComparisonActions] = useState<{
		open?: (params: ModalComparisonParams) => void;
	}>({});

	return (
		<div>
			<ModalEvolution actions={modalEvolutionActions} />
			<ModalComparison actions={modalComparisonActions} />
			<DataVizTabHeader
				dataVisualitionKind={dataVisualitionKind}
				setDataVisualitionKind={setDataVisualitionKind}
				setShowGoalRadar={setShowGoalRadar}
				setShowCrossScorePerimeter={setShowCrossScorePerimeter}
			/>
			<div className={cx(classes.grid)}>
				{data.map(item => (
					<div key={item.text} className={cx(classes.gridItem)}>
						<h2 className={cx(classes.gridTitle, 'fr-text--lg')}>
							{item.text}
						</h2>
						<p className={cx('fr-text--xs')}>
							(Nombre de démarches : {item.count})
						</p>
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
								onClick={async () => {
									const response = await modalComparisonActions.open!({
										title: `Comparer les ${kindLabel.toLowerCase()} avec ${item.text
											}`,
										baseData: item.data,
										procedureKind: kind,
										kindSlug: item.text,
										kindLabel: kindLabel,
										kindDataOptions: data.map(_ => ({
											label: _.text,
											value: _.text,
											data: _.data
										}))
									});
								}}
							>
								Comparer
							</Button>
							<Button
								priority="secondary"
								size="small"
								onClick={async () => {
									const response = await modalEvolutionActions.open!({
										title: `Voir l'évolution ${item.text}`,
										procedureKind: kind,
										kindSlug: item.text
									});
								}}
							>
								Voir l'évolution
							</Button>
							<Button size="small">Voir les démarches</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

const DataViz = () => {
	const { classes, cx } = useStyles();
	return (
		<div className={cx(classes.root)}>
			<div className="fr-container">
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
						},
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
		justifyContent: 'center',
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
		height: '325px'
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
