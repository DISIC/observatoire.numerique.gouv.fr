import { Top250TableSection } from '@/components/top250/TableSection';
import { Top250Header } from '@/components/top250/Top250Header';
import { PreHeader } from '@/components/top250/table/PreHeader';
import { StickyFooter } from '@/components/top250/table/StickyFooter';
import { useEditions, useProcedures } from '@/utils/api';
import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function ObservatoireEdition() {
	const { classes, cx } = useStyles();
	const router = useRouter();
	const { id } = router.query;

	const [search, setSearch] = useState<string>();
	const [sort, setSort] = useState<string>('volume:desc');

	const {
		data: procedures,
		isError,
		isLoading
	} = useProcedures({ search, sort, editionId: id as string });

	const { data: editions } = useEditions();
	if (!editions) return;
	const currentEdition = id
		? editions.find(edition => edition.id === (id as string))
		: editions[0];

	if (isError) return <div>Une erreur est survenue.</div>;

	return (
		<>
			<div className={fr.cx('fr-container')}>
				<Top250Header
					title={
						<>
							Suivi trimestriel de la qualité de
							<br /> vos démarches essentielles
						</>
					}
					searchLabel="Rechercher par ministère, administration, ..."
					onSearch={value => {
						setSearch(value);
					}}
				/>
			</div>
			<div className={cx(classes.tableContainer)} id="procedures-section">
				<div className={fr.cx('fr-container', 'fr-px-5v')}>
					<PreHeader
						onSort={value => {
							setSort(value.toString());
						}}
					/>
				</div>
				{isLoading || !procedures ? (
					<div className={cx(classes.loader)}>
						<div>
							<i className={fr.cx('ri-loader-4-line')} />
						</div>

						<p className={fr.cx('fr-pt-4v')}>Recherche en cours...</p>
					</div>
				) : (
					<>
						<div className={fr.cx('fr-container', 'fr-px-5v')}>
							<Top250TableSection
								edition={currentEdition}
								procedures={procedures}
								search={search}
							/>
						</div>
						<StickyFooter proceduresCount={procedures.length} />
					</>
				)}
			</div>
		</>
	);
}

const useStyles = makeStyles()(theme => ({
	tableContainer: {
		backgroundColor: theme.decisions.background.contrast.info.default,
		['.fr-container']: {
			maxWidth: 1440
		}
	},
	loader: {
		padding: fr.spacing('30v'),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		i: {
			display: 'inline-block',
			animation: 'spin 1s linear infinite;',
			color: theme.decisions.background.actionHigh.blueFrance.default,
			['&::before']: {
				'--icon-size': '2rem'
			}
		}
	}
}));
