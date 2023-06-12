import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import Link from 'next/link';

type Props = {};

export function HelpCriterias(props: Props) {
	const { classes, cx } = useStyles();

	return (
		<div className={classes.root}>
			<h2 className={cx(fr.cx('fr-h2'))}>
				Critères de recensement des services suivis
			</h2>
			<p>Chaque démarches ou service doit, pour être recensé :</p>
			<ol>
				<li>
					Comptabiliser une volumétrie annuelle supérieure à 200 000 usagers ou
				</li>
				<li>Donner accès à une aide financière publique nationale</li>
			</ol>
			<h2 className={cx(fr.cx('fr-h2'))}>
				Comment une démarche ou service peut-il être ajouté ?
			</h2>
			<p>Trois possibilités coexistent : </p>
			<ol>
				<li>
					La DINUM découvre une nouvelle démarche ou service qui respecte un des
					deux critères détaillés ci-dessus
				</li>
				<li>
					L’administration déclare directement aux équipes de la DINUM de leur
					son intention de vouloir rejoindre ce dispositif
				</li>
				<li>
					Un citoyen remarque l’absence d’une démarche ou service et le signale
				</li>
			</ol>
			<p>
				Chaque demande d’ajout est instruite par les équipes de la DINUM, qui
				vérifient la conformité de la démarche ou service aux critères. Ensuite
				elle travaille avec l’équipe concernée afin de recueillir toutes les
				informations nécessaires à leur évaluation et entrer dans une dynamique
				d’accompagnement à l’amélioration des services.
			</p>
			<Link className={fr.cx('fr-btn', 'fr-mt-4v')} href="/demande">
				Je propose l’ajout d’un service
			</Link>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		h2: {
			color: theme.decisions.background.actionHigh.blueFrance.default,
			['&:not(:first-of-type)']: {
				marginTop: fr.spacing('10v')
			}
		}
	}
}));
