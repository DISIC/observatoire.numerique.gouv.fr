import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import Link from 'next/link';

type Props = {};

export function HelpGoals(props: Props) {
	const { classes, cx } = useStyles();

	return (
		<div className={classes.root}>
			<h2 className={cx(fr.cx('fr-h2'))}>Mission</h2>
			<p>
				Vos démarches numériques essentielles,
				est un dispositif gouvernemental français chargé d&apos;évaluer et
				d&apos;améliorer la qualité des démarches et services publics numériques
				à destination de ses concitoyens.
			</p>
			<p>
				Lancé en juin 2019, ce dispositif s’inscrit dans la dynamique
				d’accélération de la transformation numérique du service public conduite
				par la Direction interministérielle du numérique (DINUM). Ce dispositif
				répond à la volonté du gouvernement de placer l’inclusion,
				l’accessibilité et l’expérience utilisateur au cœur de la conception des
				services publics numériques.
			</p>
			<p>
				Il a également pour fonction d’être un outil de pilotage
				interministériel de la qualité des démarches et services publics numériques, afin
				de s’assurer de leur transparence et de leur centrage sur les besoins
				des usagers, particuliers ou professionnels.
			</p>
			<p>
				Pour ce faire, cet outil de suivi recense les démarches et services publics numériques
				les plus utilisés par nos concitoyens et permet d’analyser, chaque
				trimestre, leur qualité à travers{' '}
				<Link href="/Aide/Observatoire?tab=indicators">5 indicateurs principaux
				</Link>.
			</p>
			<p>
				Ce outil de suivi joue un rôle essentiel dans l'amélioration des services
				publics numériques en France. Il contribue à garantir une expérience
				utilisateur optimale pour un plus grand nombre de concitoyens.
			</p>
			<h2 className={cx(fr.cx('fr-h2'))}>Objectifs gouvernementaux</h2>
			<p>
				Ce outil de suivi vise à garantir l’engagement des administrations dans
				la qualité de vos démarches et services numériques. Pour ce faire, il
				permet de visualiser l’état d’avancement des services au regard de
				différents objectifs de qualité.
			</p>
			<p><strong>Décembre 2023 :</strong></p>
			<ul>
				<li>
					Bascule des démarches sensibles sur FranceConnect+, notamment celles
					impliquant des flux financiers
				</li>
				<li>
					Connexion de chaque service à FranceConnect ou FranceConnect+ en
					fonction du niveau de risque
				</li>
			</ul>
			<p><strong>Eté 2024 :</strong></p>
			<ul>
				<li>
					Satisfaction usager supérieure à 8/10
				</li>
			</ul>
			<p><strong>Décembre 2024 :</strong></p>
			<ul>
				<li>
					Affichage systématique d’une alternative non-numérique – guichet physique ou point de contact téléphonique pour toutes les démarches
				</li>
			</ul>
			<p><strong>Décembre 2025 :</strong></p>
			<ul>
				<li>
					Conformité de 100% aux critères d’accessibilité pour les personnes en
					situation de handicap (avec des avancées notables sous 18 mois)
				</li>
				<li>
					Simplicité du langage supérieure à 8/10
				</li>
			</ul>
			<p><strong>Décembre 2026 :</strong></p>
			<ul>
				<li>
					Réalisable en ligne
				</li>
				<li>
					Ne plus demander à l’usager les données déjà détenues par
					l’administration, et ne plus demander des données qui ne servent pas
					l’administration
				</li>
			</ul>
			<h2 className={cx(fr.cx('fr-h2'))}>Méthodologie</h2>
			<p>
				Les équipes de la direction interministérielle du numérique qui pilotent
				ce dispositif de suivi sont responsables de mesurer la progression des
				démarches et des services.
			</p>
			<p>
				Elles effectuent des audits régulières des démarches et services, en
				évaluant des aspects tels que la facilité d&apos;utilisation,
				la clarté des informations fournies, l&apos;accessibilité aux personnes
				handicapées, la rapidité de chargement des pages, etc.
			</p>
			<p>
				Ces analyses sont publiéés tous les trois mois sur ce site et sur
				data.gouv.fr, permettant aux administrations concernées de prendre
				connaissance des améliorations nécessaires et de mettre en œuvre des
				actions correctives.
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
