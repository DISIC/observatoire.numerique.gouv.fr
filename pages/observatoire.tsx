import { Top250Header } from '@/components/top250/Header';
import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
export default function Observatoire() {
	const { classes, cx } = useStyles();

	return (
		<div className={cx(fr.cx('fr-container'), classes.root)}>
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
	);
}

const useStyles = makeStyles()(theme => ({
	root: {}
}));
