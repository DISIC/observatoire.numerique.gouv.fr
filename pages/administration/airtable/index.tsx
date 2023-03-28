import { Top250TableSection } from '@/components/top250/TableSection';
import { useProcedures } from '@/utils/api';
import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';

export default function Airtable() {
	const { classes, cx } = useStyles();

	// TO REPLACE WITH AIRTABLE GETTER
	const { data: procedures, isError, isLoading } = useProcedures();
	if (isError) return <div>Une erreur est survenue.</div>;
	if (isLoading) return <div>...</div>;
	if (!procedures) return <div>Aucune démarche</div>;

	return (
		<div className={cx(classes.root)}>
			<div className={cx(fr.cx('fr-container'), classes.controlPanel)}>
				<Button type="button">Publier l'édition</Button>
			</div>
			<div className={cx(classes.tableContainer)}>
				<div className={fr.cx('fr-container', 'fr-px-5v')}>
					<Top250TableSection procedures={procedures} isAdmin />
				</div>
			</div>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		paddingTop: fr.spacing('10v')
	},
	controlPanel: {
		paddingBottom: fr.spacing('10v'),
		display: 'flex',
		justifyContent: 'end'
	},
	tableContainer: {
		paddingTop: fr.spacing('6v'),
		backgroundColor: theme.decisions.background.contrast.info.default,
		['.fr-container']: {
			maxWidth: 1440
		}
	}
}));
