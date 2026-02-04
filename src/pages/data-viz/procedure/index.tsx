import { tss } from 'tss-react';
import { fr } from '@codegouvfr/react-dsfr';
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb';
import DataVizProceduresList from '@/components/data-viz/ProcedureList';

const DataVizProcedures = () => {
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.root)}>
			<div className={fr.cx('fr-container', 'fr-pt-6v')}>
				<Breadcrumb
					segments={[]}
					homeLinkProps={{ href: '/' }}
					currentPageLabel={`Graphiques - Démarches`}
					className={fr.cx('fr-mb-1v')}
				/>
				<h1>Démarches</h1>
				<DataVizProceduresList />
			</div>
		</div>
	);
};

const useStyles = tss.withName(DataVizProcedures.name).create(() => ({
	root: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
		['& > div > h1']: {
			...fr.typography[11].style,
			color: fr.colors.decisions.background.actionHigh.blueFrance.default
		}
	}
}));

export default DataVizProcedures;
