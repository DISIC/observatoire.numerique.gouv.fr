import { Top250TableSection } from '@/components/top250/TableSection';
import { ProcedureWithFields } from '@/pages/api/procedures/types';
import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { useEffect, useState } from 'react';

export default function Airtable() {
	const { classes, cx } = useStyles();

	const [procedures, setProcdeures] = useState<ProcedureWithFields[]>([]);

	const getProceduresFormAirtalbe = async () => {
		const res = await fetch('/api/airtable/demarches');
		const json = await res.json();

		setProcdeures(json.data);
	};

	useEffect(() => {
		getProceduresFormAirtalbe();
	}, []);

	if (!procedures.length) return <></>;

	return (
		<div className={cx(classes.root)}>
			<div className={cx(fr.cx('fr-container'), classes.controlPanel)}>
				<Button type="button">Publier l&apos;édition</Button>
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
