import { Top250TableSection } from '@/components/top250/TableSection';
import { Top250Header } from '@/components/top250/Top250Header';
import { StickyFooter } from '@/components/top250/table/StickyFooter';
import { useEdition, useProcedures } from '@/utils/api';
import { fr } from '@codegouvfr/react-dsfr';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { tss } from 'tss-react';
import { Breadcrumb } from '@codegouvfr/react-dsfr/Breadcrumb';

export default function ObservatoireEdition() {
	const { classes, cx } = useStyles();
	const router = useRouter();
	const { slug: edition_slug } = router.query;

	const [search, setSearch] = useState<string>();
	const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
	const [selectedAdministration, setSelectedAdministration] =
		useState<string>('all');

	const { data: edition } = useEdition({
		id: edition_slug as string | undefined,
		kind: 'slug'
	});

	const {
		data: procedures,
		isError,
		isLoading
	} = useProcedures({
		search,
		editionId: edition?.id as string,
		department: selectedDepartment,
		administration: selectedAdministration
	});

	if (!edition) return;

	if (isError) return <div>Une erreur est survenue.</div>;

	return (
		<>
			<div className={fr.cx('fr-container')}>
				<Breadcrumb
					currentPageLabel={edition?.name}
					segments={[
						{
							label: 'Éditions précédentes',
							linkProps: { href: '/observatoire/editions' }
						}
					]}
					className={fr.cx('fr-mb-0', 'fr-mt-4w')}
				/>
				<Top250Header
					title="Suivi trimestriel de la qualité de vos démarches essentielles"
					subtitle={`Édition de ${edition?.name.toLowerCase()}`}
					searchLabel="Rechercher par mots clés..."
					onSearch={value => setSearch(value)}
					setSelectedDepartment={setSelectedDepartment}
					setSelectedAdministration={setSelectedAdministration}
					nbResults={procedures ? procedures.length : null}
					editionId={edition?.id}
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
								edition={edition}
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
