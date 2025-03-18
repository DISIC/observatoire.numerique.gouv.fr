import { tss } from 'tss-react';
import { fr } from '@codegouvfr/react-dsfr';
import Tabs from '@codegouvfr/react-dsfr/Tabs';
import { useAdministrations, useDepartments } from '@/utils/api';
import dynamic from 'next/dynamic';
import Button from '@codegouvfr/react-dsfr/Button';

const RadarChartCustom = dynamic(
	() => import('../components/charts/RadarChart')
);

const TabContent = ({ kind }: { kind: 'department' | 'administration' }) => {
	const { classes, cx } = useStyles();
	const { data } =
		kind === 'department' ? useDepartments('base') : useAdministrations();

	return (
		<div>
			{/* <TabHeader /> */}
			<div className={cx(classes.grid)}>
				{data.map(item => (
					<div key={item} className={cx(classes.gridItem)}>
						<h2 className={cx(classes.gridTitle)}>{item}</h2>
						<div className={cx(classes.chart)}>
							<RadarChartCustom />
						</div>
						<div className={cx(classes.buttonsGroup)}>
							<Button priority="secondary" size="small">
								Comparer
							</Button>
							<Button priority="secondary" size="small">
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
							label: 'Périmètres ministériels',
							content: <TabContent kind="department" />
						},
						{
							label: 'Administrations',
							content: <TabContent kind="administration" />
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
		justifyContent: 'center',
		textAlign: 'center',
		borderRadius: fr.spacing('2v'),
		padding: `${fr.spacing('3w')} ${fr.spacing('4v')}`,
		border: `1px solid ${fr.colors.decisions.background.contrast.blueFrance.default}`
	},
	gridTitle: {
		fontWeight: 500,
		fontSize: '18px',
		lineHeight: '28px',
		color: fr.colors.decisions.text.title.grey.default
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
	}
}));

export default DataViz;
