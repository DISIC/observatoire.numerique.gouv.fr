import { tss } from 'tss-react';
import { fr } from '@codegouvfr/react-dsfr';
import { useIndicatorScoreByProcedureKind } from '@/utils/api';
import dynamic from 'next/dynamic';
import Button from '@codegouvfr/react-dsfr/Button';
import DataVizTabHeader from '@/components/data-viz/Header';
import { useState } from 'react';
import { getProcedureKindLabel, stringToBase64Url } from '@/utils/tools';
import { ProcedureKind } from '@/pages/api/indicator-scores';
import TableView from '@/components/data-viz/TableView';
import { useDebounce } from '@uidotdev/usehooks';
import { Loader } from '@/components/generic/Loader';
import { useRouter } from 'next/router';
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb';
import { GetServerSidePropsContext } from 'next';

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

	const { data, isLoading: isLoadingIndicatorScores } =
		useIndicatorScoreByProcedureKind({
			kind,
			search: debouncedSearchTerm
		});

	const [showGoalRadar, setShowGoalRadar] = useState(false);
	const [showCrossScorePerimeter, setShowCrossScorePerimeter] = useState(false);

	const [dataVisualitionKind, setDataVisualitionKind] = useState<
		'radar' | 'table'
	>('radar');

	const isLoading =
		isLoadingIndicatorScores || debouncedSearchTerm !== searchTerm;

	const headers = [
		'',
		...(data[0]?.data.map(d => d.name) || []),
		'Nombre de démarches'
	];

	const rows = data.map(item => ({
		title: item.text,
		cells: {
			...item.data.reduce(
				(acc, current) => ({
					...acc,
					[current.slug]: `${current.score}%`
				}),
				{}
			),
			Démarches: item.count.toString()
		}
	}));

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
			{isLoading ? (
				<div className={fr.cx('fr-py-20v', 'fr-mt-4w')}>
					<Loader />
				</div>
			) : data.length === 0 ? (
				<div className={fr.cx('fr-grid-row', 'fr-grid-row--center')}>
					<div
						className={cx(
							fr.cx('fr-col-12', 'fr-col-md-5', 'fr-my-30v'),
							classes.textContainer
						)}
						role="status"
					>
						<p aria-live="assertive">
							Aucun{kind === 'administration' ? 'e' : ''}{' '}
							{getProcedureKindLabel(kind)}{' '}
							{searchTerm ? `pour la recherche "${searchTerm}"` : ''}
						</p>
					</div>
				</div>
			) : (
				<>
					<TableView
						headers={headers}
						rows={rows}
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
											size="small"
											linkProps={{
												href: `/data-viz/${kind}/${stringToBase64Url(
													item.text
												)}`
											}}
										>
											Analyser les indicateurs
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</>
			)}
		</div>
	);
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	const kind = ctx.query.kind;

	if (typeof kind !== 'string')
		return {
			notFound: true
		};

	return {
		props: {
			kind
		}
	};
}

const DataViz = ({ kind }: { kind: ProcedureKind }) => {
	const { classes, cx } = useStyles();

	const kindLabel =
		getProcedureKindLabel(kind as ProcedureKind, {
			plural: true,
			uppercaseFirst: true
		}) || '';

	return (
		<div className={cx(classes.root)}>
			<div className={fr.cx('fr-container', 'fr-pt-6v')}>
				<Breadcrumb
					segments={[]}
					homeLinkProps={{ href: '/' }}
					currentPageLabel={`Graphiques - ${kindLabel}`}
					className={fr.cx('fr-mb-1v')}
				/>
				<h1>{kindLabel}</h1>
				<div className={cx(classes.tabsWrapper)}>
					<TabContent kind={kind} kindLabel={kindLabel} />
				</div>
			</div>
		</div>
	);
};

const useStyles = tss.withName(DataViz.name).create(() => ({
	root: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
		['& > div > h1']: {
			...fr.typography[11].style,
			color: fr.colors.decisions.background.actionHigh.blueFrance.default
		}
	},
	tabsWrapper: {
		backgroundColor: 'white',
		border: 'none',
		padding: fr.spacing('6v'),
		borderRadius: fr.spacing('2v')
	},
	grid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(3, 1fr)',
		gap: fr.spacing('6v'),
		[fr.breakpoints.down('md')]: {
			gridTemplateColumns: '1fr'
		}
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
	},
	textContainer: {
		textAlign: 'center',
		p: {
			margin: 0,
			fontWeight: 'bold'
		}
	}
}));

export default DataViz;
