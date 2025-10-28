import ProcedureIndicatorsGridItem from '@/components/data-viz/ProcedureIndicatorsGridItem';
import TableView from '@/components/data-viz/TableView';
import { Loader } from '@/components/generic/Loader';
import { ProcedureKind } from '@/pages/api/indicator-scores';
import { ProceduresProps, useProcedures } from '@/utils/api';
import { isValidIndicatorSlug } from '@/utils/data-viz-client';
import { exportTableAsCSV } from '@/utils/tools';
import { trpc } from '@/utils/trpc';
import { fr } from '@codegouvfr/react-dsfr';
import SearchBar from '@codegouvfr/react-dsfr/SearchBar';
import { useDebounce } from '@uidotdev/usehooks';
import assert from 'assert';
import { useState } from 'react';
import { tss } from 'tss-react';

type DataVizProceduresListProps = {
	kind?: ProcedureKind;
	slug?: string;
};

const DataVizProceduresList = ({ kind, slug }: DataVizProceduresListProps) => {
	const [search, setSearch] = useState<string>();
	const debouncedSearchTerm = useDebounce(search, 300);

	const { classes, cx } = useStyles();

	const [inputElement, setInputElement] = useState<HTMLInputElement | null>(
		null
	);

	const kindKey = kind !== 'ministere' ? kind : 'department';

	const { data: procdeureHeadersRequest, isLoading: isLoadingIndicators } =
		trpc.indicators.getList.useQuery({
			page: 1,
			perPage: 100
		});

	const indicators =
		procdeureHeadersRequest?.data.filter(indicator =>
			isValidIndicatorSlug(indicator.slug)
		) || [];

	const query: ProceduresProps = {
		search: debouncedSearchTerm
	};

	if (slug && kindKey) {
		query[kindKey] = slug;
	}

	const {
		data,
		isError,
		isLoading: isLoadingProcedures
	} = useProcedures(query);

	const procedures = data?.map(procedure => {
		const fields = procedure.fields.filter(field =>
			isValidIndicatorSlug(field.slug)
		);
		return {
			...procedure,
			fields
		};
	});

	const isLoading =
		isLoadingProcedures ||
		isLoadingIndicators ||
		debouncedSearchTerm !== search;

	const headers = [
		'Démarches',
		...((procedures &&
			procedures[0]?.fields.map(
				d => indicators.find(i => i.slug === d.slug)?.label || d.slug
			)) ||
			[])
	];

	const rows =
		procedures?.map(item => ({
			title: item.title,
			cells: item.fields.reduce((acc, current) => {
				const finalLabel =
					current.label.includes('Partiel') && current.value
						? current.label + ` - ${current.value}%`
						: current.label;
				return {
					...acc,
					[current.slug]: finalLabel
				};
			}, {})
		})) || [];

	if (isError) return <div>Une erreur est survenue.</div>;

	return (
		<div className={classes.pageContent}>
			<div className={cx(classes.wrapperSearch)}>
				<SearchBar
					label="Rechercher"
					className={cx(classes.searchInput)}
					renderInput={({ className, id, type }) => (
						<input
							ref={setInputElement}
							className={className}
							id={id}
							placeholder={`Rechercher une démarche`}
							type={type}
							value={search}
							onChange={event => setSearch(event.currentTarget.value)}
							onKeyDown={event => {
								if (event.key === 'Escape' && inputElement !== null) {
									assert(inputElement !== null);
									inputElement.blur();
								}
							}}
						/>
					)}
				/>
			</div>
			{isLoading ? (
				<div className={fr.cx('fr-py-20v', 'fr-mt-4w')}>
					<Loader />
				</div>
			) : procedures?.length === 0 ? (
				<div className={fr.cx('fr-grid-row', 'fr-grid-row--center')}>
					<div
						className={cx(
							fr.cx('fr-col-12', 'fr-col-md-5', 'fr-my-30v'),
							classes.textContainer
						)}
						role="status"
					>
						<p aria-live="assertive">
							Aucune démarche {search ? `pour la recherche "${search}"` : ''}
						</p>
					</div>
				</div>
			) : (
				<div className={cx(classes.grid)}>
					{procedures?.map(item => (
						<ProcedureIndicatorsGridItem
							key={item.id}
							procedure={item}
							indicators={indicators}
						/>
					))}
				</div>
			)}
		</div>
	);
};

const useStyles = tss.create({
	loader: {
		padding: fr.spacing('30v'),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		i: {
			display: 'inline-block',
			animation: 'spin 1s linear infinite;',
			color: fr.colors.decisions.background.actionHigh.blueFrance.default,
			['&::before']: {
				'--icon-size': '2rem'
			}
		}
	},
	pageContent: {
		backgroundColor: 'white',
		borderRadius: fr.spacing('2v'),
		padding: fr.spacing('6v')
	},
	wrapperSearch: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: fr.spacing('6v'),
		[fr.breakpoints.down('md')]: {
			flexDirection: 'column',
			alignItems: 'stretch',
			gap: fr.spacing('4v'),
			'& > div': {
				width: '100%',
				justifyContent: 'space-between'
			}
		}
	},
	searchInput: {
		width: '100%'
	},
	grid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(2, 1fr)',
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
		gap: fr.spacing('5v'),
		borderRadius: fr.spacing('2v'),
		padding: `${fr.spacing('3w')} ${fr.spacing('4v')}`,
		border: `1px solid ${fr.colors.decisions.background.contrast.blueFrance.default}`
	},
	gridTitle: {
		fontWeight: 500,
		color: fr.colors.decisions.text.title.grey.default,
		marginBottom: fr.spacing('1v')
	},
	procredureStats: {
		...fr.spacing('padding', { rightLeft: '4v' }),
		border: `1px solid ${fr.colors.decisions.background.contrast.blueFrance.default}`,
		borderRadius: fr.spacing('2v'),
		width: '100%',
		marginTop: 'auto'
	},
	indicator: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: fr.spacing('4v'),
		borderRadius: fr.spacing('3v'),
		width: '100%',
		'i::before, i::after ': {
			'--icon-size': '1.25rem',
			color: fr.colors.decisions.text.title.blueFrance.default
		}
	},
	indicatorLabelContainer: {
		alignItems: 'center'
	},
	indicatorLabel: {
		fontWeight: 500,
		fontSize: '0.875rem',
		lineHeight: '1.5rem'
	},
	textContainer: {
		textAlign: 'center',
		p: {
			margin: 0,
			fontWeight: 'bold'
		}
	}
});

export default DataVizProceduresList;
