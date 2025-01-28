import { Top250Header } from '@/components/top250/Top250Header';
import { OldProceduresTable } from '@/components/top250/table/OldProceduresTable';
import { PreHeader } from '@/components/top250/table/PreHeader';
import { StickyFooter } from '@/components/top250/table/StickyFooter';
import { useDepartments, useOldProcedures } from '@/utils/api';
import { fr } from '@codegouvfr/react-dsfr';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { tss } from 'tss-react';

export const oldDefaultSort = 'volumetrie_value:desc';

export default function ObservatoireEdition() {
	const { classes, cx } = useStyles();
	const router = useRouter();
	const { slug } = router.query;

	const [search, setSearch] = useState<string>();
	const [sort, setSort] = useState<string>(oldDefaultSort);
	const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

	const {
		data: procedures,
		isError,
		isLoading
	} = useOldProcedures({
		search,
		sort,
		xwiki_edition: slug as string,
		department: selectedDepartment
	});

	const { data: departments } = useDepartments('old');

	if (isError) return <div>Une erreur est survenue.</div>;

	return (
		<>
			<div className={fr.cx('fr-container')}>
				<Top250Header
					title={<>Anciennes éditions de l&apos;observatoire 1.0</>}
					searchLabel="Rechercher par mots clés..."
					onSearch={value => {
						setSearch(value);
					}}
					departments={departments}
					setSelectedDepartment={setSelectedDepartment}
					old
				/>
			</div>
			<div className={cx(classes.tableContainer)} id="procedures-section">
				<div className={fr.cx('fr-container', 'fr-px-5v')}>
					<PreHeader sort={sort} setSort={setSort} old />
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
							<OldProceduresTable
								procedures={procedures}
								setSort={setSort}
								sort={sort}
							/>
						</div>
						<StickyFooter proceduresCount={procedures.length} />
					</>
				)}
			</div>
		</>
	);
}

const useStyles = tss.withName(ObservatoireEdition.name).create(() => ({
	tableContainer: {
		backgroundColor: fr.colors.decisions.background.contrast.info.default,
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
			color: fr.colors.decisions.background.actionHigh.blueFrance.default,
			['&::before']: {
				'--icon-size': '2rem'
			}
		}
	}
}));
