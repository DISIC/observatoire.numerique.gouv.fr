import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb';
import { Top250TableSection } from '@/components/top250/TableSection';
import { Top250Header } from '@/components/top250/Top250Header';
import { StickyFooter } from '@/components/top250/table/StickyFooter';
import { useEdition, useProcedures } from '@/utils/api';
import { fr } from '@codegouvfr/react-dsfr';
import { useState } from 'react';
import { tss } from 'tss-react';

export default function Observatoire() {
	const { classes, cx } = useStyles();

	const [search, setSearch] = useState<string>();
	const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
	const [selectedAdministration, setSelectedAdministration] =
		useState<string>('all');

	const {
		data: procedures,
		isError,
		isLoading
	} = useProcedures({
		search,
		department: selectedDepartment,
		administration: selectedAdministration
	});

	const { data: currentEdition } = useEdition({
		id: 'current',
		kind: 'id'
	});

	if (isError) return <div>Une erreur est survenue.</div>;

	return (
		<>
			<div className={cx(classes.root, fr.cx('fr-container'))}>
				<Breadcrumb
					segments={[]}
					homeLinkProps={{ href: '/' }}
					currentPageLabel={`Éditions - Édition de ${
						currentEdition?.name.toLowerCase() || '...'
					}`}
					className={cx('fr-mb-1v')}
				/>
				<Top250Header
					title="Suivi trimestriel de la qualité de vos démarches essentielles"
					subtitle={`Édition de ${currentEdition?.name.toLowerCase()}`}
					searchLabel="Rechercher par mots clés..."
					onSearch={value => setSearch(value)}
					setSelectedDepartment={setSelectedDepartment}
					setSelectedAdministration={setSelectedAdministration}
					nbResults={procedures ? procedures.length : null}
					editionId={currentEdition?.id}
				/>
			</div>
			<div className={cx(classes.tableContainer)} id="procedures-section">
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

const useStyles = tss.withName(Observatoire.name).create(() => ({
	root: {
		marginTop: fr.spacing('10v') // fr.spacing('1w') for classic
	},
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
