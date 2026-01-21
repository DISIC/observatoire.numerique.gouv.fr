import DataVizTabHeader from '@/components/data-viz/Header';
import RadarWrapper from '@/components/data-viz/RadarWrapper';
import TableView from '@/components/data-viz/TableView';
import { Loader } from '@/components/generic/Loader';
import { ProcedureKind } from '@/pages/api/indicator-scores';
import { useEdition, useIndicatorScoreByProcedureKind } from '@/utils/api';
import { getProcedureKindLabel, getTableHeadersFromData } from '@/utils/tools';
import { fr } from '@codegouvfr/react-dsfr';
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb';
import { useDebounce } from '@uidotdev/usehooks';
import { GetServerSidePropsContext } from 'next';
import { useState } from 'react';
import { tss } from 'tss-react';

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
		{ name: `Nom ${getProcedureKindLabel(kind)}`, description: '' },
		...getTableHeadersFromData(data[0]?.data || []),
		{ name: 'Nombre de démarches', description: '' }
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
					>
						<p role="status" aria-atomic aria-live="polite">
							Aucun{kind === 'administration' ? 'e' : ''}{' '}
							{getProcedureKindLabel(kind)}{' '}
							{searchTerm ? `pour la recherche "${searchTerm}"` : ''}
						</p>
					</div>
				</div>
			) : (
				<>
					<p
						className={fr.cx('fr-sr-only')}
						role="status"
						aria-atomic
						aria-live="polite"
					>
						{data.length}{' '}
						{getProcedureKindLabel(kind, {
							plural: data.length > 1
						})}{' '}
						trouvés
					</p>
					<TableView
						title={`Tableau des scores des ${getProcedureKindLabel(kind, {
							plural: true
						})}`}
						headers={headers}
						rows={rows}
						hidden={dataVisualitionKind !== 'table'}
						tableId={`table-${kind}`}
					/>
					{dataVisualitionKind === 'radar' && (
						<div className={cx(classes.grid)}>
							{data.map(item => (
								<RadarWrapper
									key={item.text}
									item={item}
									kind={kind}
									radarCustomChartProps={{
										showGoalRadar,
										showCrossScorePerimeter
									}}
								/>
							))}
						</div>
					)}
					<p role="status" className={fr.cx('fr-sr-only')}>
						{data.length} résultats
					</p>
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

	const { data: currentEdition } = useEdition({
		id: 'current',
		kind: 'id'
	});

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
				<h1 className={cx(classes.title)}>{kindLabel}</h1>
				<h2 className={cx(fr.cx('fr-h3'), classes.subtitle)}>
					Données basées sur la dernière édition (
					{currentEdition?.name.toLowerCase() || 'N/A'})
				</h2>
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
	modal: {
		textAlign: 'start'
	},
	textContainer: {
		textAlign: 'center',
		p: {
			margin: 0,
			fontWeight: 'bold'
		}
	},
	title: {
		color: fr.colors.decisions.background.actionHigh.blueFrance.default,
		marginBottom: '0!important'
	},
	subtitle: {
		color: fr.colors.decisions.artwork.minor.blueFrance.default,
		marginBottom: fr.spacing('4w')
	}
}));

export default DataViz;
