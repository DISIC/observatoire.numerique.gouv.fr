import { Top250Header } from '@/components/top250/Header';
import { Top250TableSection } from '@/components/top250/TableSection';
import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { StickyFooter } from '@/components/top250/table/StickyFooter';
import { useProcedures } from '@/utils/api';

export default function Observatoire() {
	const { classes, cx } = useStyles();

	const { data: procedures, isError, isLoading } = useProcedures();
	if (isError) return <div>Une erreur est survenue.</div>;
	if (isLoading) return <div>...</div>;
	if (!procedures) return <div>Aucune démarche</div>;

	return (
		<>
			<div className={fr.cx('fr-container')}>
				<Top250Header
					title={
						<>
							Suivi trimestriel de la qualité
							<br /> des services numériques phares de l’État
						</>
					}
					searchLabel="Rechercher par ministère, administration, ..."
				/>
			</div>
			<div className={cx(classes.tableContainer)}>
				<div className={fr.cx('fr-container', 'fr-px-5v')}>
					<Top250TableSection procedures={procedures} />
				</div>
				<StickyFooter proceduresCount={procedures.length} />
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
	}
}));
