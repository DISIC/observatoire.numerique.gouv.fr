import { Top250Header } from '@/components/top250/Header';
import { Top250TableSection } from '@/components/top250/TableSection';
import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { proceduresMock } from '@/utils/mock';
import { StickyFooter } from '@/components/table/StickyFooter';

export default function Observatoire() {
	const { classes, cx } = useStyles();

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
					<Top250TableSection procedures={proceduresMock} />
				</div>
				<StickyFooter proceduresCount={proceduresMock.length} />
			</div>
		</>
	);
}

const useStyles = makeStyles()(theme => ({
	tableContainer: {
		backgroundColor: theme.decisions.background.contrast.info.default
	}
}));
