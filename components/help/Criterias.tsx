import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';

type Props = {};

export function HelpCriterias(props: Props) {
	const { classes, cx } = useStyles();

	return (
		<div className={classes.root}>
			<h2 className={cx(fr.cx('fr-h2'))}>
				Les critères d’entrée des services à l’observatoire de la qualité des
				services.
			</h2>
			<p>
				La sélection des services a pour vocation à sélectionner les services
				les plus utilisés et ayant le plus d’impact dans la vie des concitoyens.
			</p>

			<p>Ces critères d’entrée sont au nombre de deux :</p>
			<ol>
				<li>
					Le service doit comptabiliser une volumétrie annuelle supérieure à 200
					000 usagers.
				</li>
				<li>
					Le service donne accès à une aide / une prestation financière publique
					nationale.
				</li>
			</ol>
			<h2 className={cx(fr.cx('fr-h2'))}>
				Comment un service peut-il entrer à l’observatoire ?
			</h2>
			<p>Trois possibilités d’entrée à l’observatoire coexistent : </p>
			<ol>
				<li>
					L’administration déclare directement à l’observatoire son intention de
					vouloir rejoindre l’observatoire.
				</li>
				<li>
					Le travail de recherche de nos experts des services publics numérique
					à fort impact. Notre équipe analyse et répertorie les services publics
					de l’Etat correspondant à ces critères. Ces services sont alors
					contacté et informé de la possibilité de consulter les données
					concernant leur service mais aussi de permettre le recueil des données
					les plus justes.
				</li>
				<li>
					Demande provenant des toute personne ayant remarqué l’absence d’un
					service à la liste de l’observatoire, qu’il s’agisse d’usagers ou
					encore d’agents de l’administration.
				</li>
			</ol>
			<p>
				Suite à la soumission d’un service publics numérique, les équipe de
				l’observatoire vérifient la conformité du services aux critères, puis
				contacte le service pour aider afin de recueillir toutes les
				informations nécessaire à leur évaluation et entrer dans une dynamique
				d’accompagnement à l’amélioration des services.
			</p>
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
