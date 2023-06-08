import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import Link from 'next/link';

type Props = {};

export function HelpGoals(props: Props) {
	const { classes, cx } = useStyles();

	return (
		<div className={classes.root}>
			<h2 className={cx(fr.cx('fr-h2'))}>L&apos;observatoire</h2>
			<p>
				L’Observatoire de la qualité des services publiques, anciennement
				“Observatoire de la qualité des démarches en ligne”, est une entité
				gouvernementale française chargée d&apos;évaluer et d&apos;améliorer la
				qualité des services publics numérique à destination de ses concitoyens.
			</p>
			<p>
				Lancé en juin 2019, l’observatoire s’inscrit dans la dynamique
				d’accélération de la transformation numérique du service public conduite
				par la Direction interministérielle du numérique (DINUM). Ce dispositif
				répond à la volonté du gouvernement de placer l’inclusion,
				l’accessibilité et l’expérience utilisateur au cœur de la conception des
				services publics numériques.
			</p>
			<p>
				L’observatoire a également pour fonction d’être un outil de pilotage
				interministériel de la qualité de nos services publics numériques, afin
				de s’assurer de leur transparence et de leur centrage sur les besoins
				des usagers.
			</p>
			<p>
				Pour ce faire, l’observatoire recense les services publics numériques
				les plus utilisés par nos concitoyens et permet d’analyser, chaque
				trimestre, leur qualité à travers{' '}
				<Link href="/Aide/Observatoire?tab=indicators">onze critères</Link>{' '}
				déterminés, via notamment les retours directs des usagers.
			</p>
			<p>
				En résumé, l&apos;observatoire de la qualité des démarches en ligne de
				la DINUM joue un rôle essentiel dans l&apos;amélioration des services
				publics numériques en France. Il contribue à garantir une expérience
				utilisateur optimale, en veillant à ce que les sites web et les
				applications mobiles des administrations répondent aux normes de qualité
				et aux attentes de ses concitoyens.
			</p>
			<h2 className={cx(fr.cx('fr-h2'))}>Les objectifs</h2>
			<p>
				L’observatoire vise à garantir l’engagement des administrations dans la
				qualité de leurs services numériques. Pour ce faire, il permet de
				visualiser l’état d’avancement des services au regard de différents
				objectifs de qualité.
			</p>
			<p>Les grands objectifs de l’observatoire sont de :</p>
			<ol>
				<li>
					<strong>
						Sensibiliser les acteurs chargés de penser les services publics
						numériques aux enjeux d’une conception centrée sur les besoins des
						usagers
					</strong>{' '}
					: l’observatoire joue donc un rôle important dans l’information et la
					communication aux administrations des critères de qualité de
					l’expérience usager. Il communique les résultats de ses évaluations,
					partage les bonnes pratiques et organise des événements pour
					promouvoir l&apos;amélioration continue de la qualité des démarches en
					ligne.
				</li>
				<li>
					<strong>
						Présenter aux Ministères et Administrations une vue holistique de
						l’état d’avancement du passage au numérique
					</strong>{' '}
					de l’ensemble de leurs services les plus utilisés par leur concitoyen.
					Permettant ainsi de prioriser et structurer une stratégie de
					conception des services publics numériques.
				</li>

				<li>
					L&apos;observatoire se pense également au travers de référentiels
					internationaux pour évaluer la qualité des services en ligne. Il
					permet de comparer les performances des administrations françaises
					avec celles d&apos;autres pays afin d&apos;identifier les bonnes
					pratiques et de favoriser les échanges d&apos;expérience.
				</li>
			</ol>
			<p>
				L’évaluation proposé par l’observatoire à destination des administration
				poursuit plusieurs objectifs principaux :
			</p>
			<ol>
				<li>
					<strong>
						Accélérer le passage des services publics de l’État au numérique
					</strong>{' '}
					: l’objectif est de rendre tous les services publics, en partant des
					plus utilisés, réalisables en ligne de bout en bout.
				</li>
				<li>
					<strong>Favoriser l&apos;expérience utilisateur</strong> : Son
					objectif est de rendre ces démarches en ligne simples, intuitives et
					efficaces, en s&apos;assurant que les utilisateurs peuvent facilement
					accéder aux informations et effectuer leurs démarches de manière
					fluide.
				</li>
				<li>
					<strong>
						Faire de l’accessibilité et de la prise en compte du handicap une
						priorité
					</strong>{' '}
					pour les services publics.
				</li>
				<li>
					<strong>
						Mesurer et évaluer la performance des services en ligne
					</strong>{' '}
					: il s’agit de pouvoir rendre compte des temps pendant lesquels les
					usagers ne peuvent effectuer leur démarche ou consulter le service. Il
					est aussi question de rendre les services consultables et utilisables
					quelque soit la vitesse de sa connexion internet.
				</li>
			</ol>
			<p>
				En résumé, les objectifs de l&apos;observatoire de la qualité des
				démarches en ligne de la DINUM sont d&apos;améliorer la qualité des
				services publics numériques, d&apos;optimiser l&apos;expérience
				utilisateur, de mesurer la performance des services en ligne, de fournir
				des recommandations et des conseils, et de sensibiliser les acteurs
				concernés à l&apos;importance de la qualité des démarches en ligne.
			</p>
			<h2 className={cx(fr.cx('fr-h2'))}>La méthodologie</h2>
			<p>
				L&apos;observatoire de la qualité des services numérique utilise des
				méthodologies d&apos;évaluation à l’aide de critères clés de qualité.
				Ces critères sont aujourd’hui le moyen de mesurer la progression des
				différents services et de leur administrations. Nous parlerons
				d’avantage de la fonction de ces{' '}
				<Link href="/Aide/Observatoire?tab=indicators">indicateurs</Link> dans
				la section concernée.
			</p>
			<p>
				L’observatoire effectue des audits réguliers des sites web et des
				applications mobiles, en évaluant des aspects tels que la facilité
				d&apos;utilisation, la clarté des informations fournies,
				l&apos;accessibilité pour les personnes handicapées, la sécurité des
				données et la satisfaction des utilisateurs.
			</p>
			<p>
				Les résultats de ces évaluations sont ensuite publiés sous forme de
				classements et de rapports trimestriel, permettant aux administrations
				concernées de prendre connaissance des améliorations nécessaires et de
				mettre en œuvre des actions correctives.
			</p>
			<p>
				L&apos;observatoire de la qualité des démarches en ligne de la DINUM
				utilise différentes méthodologies pour évaluer la qualité des services
				publics en ligne. Ces méthodologie sont guidé par les{' '}
				<Link href="/Aide/Observatoire?tab=indicators">
					indicateurs de qualités
				</Link>
				. Il s’agit d’une série d’indicateurs composé d’indicateurs clés et
				d’indicateurs complémentaires ayant pour fonction de préciser
				l’évaluation des services.
			</p>
			<p>Voici quelques-unes des approches utilisées :</p>
			<ol>
				<li>
					<strong>Les enquêtes de satisfaction</strong> : via la mise en place
					du bouton ”je donne mon avis” qui se positionne à la fin d’une
					démarche pour ses utilisateurs. Il permet ainsi de recueillir leurs
					retours et évaluer leur satisfaction vis-à-vis des services en ligne.
					Cela permet d&apos;identifier les points forts et les points à
					améliorer.
				</li>
				<li>
					<strong>L&apos;accessibilité</strong> : L&apos;observatoire réalise
					des audits afin de mesurer la conformité des services publics
					numériques aux normes d’accessibilité, conformément aux normes en
					vigueur. L’accessibilité consiste en la prise en compte des
					contraintes d’usages des personnes en situation de handicap. Cela
					englobe des critères tels que la compatibilité avec les technologies
					d&apos;assistance, la lisibilité des contenus, la possibilité de
					naviguer avec le clavier, etc.
				</li>
				<li>
					<strong>L&apos;audit technique</strong> : L&apos;observatoire effectue
					des audits techniques approfondis des sites web et des applications
					mobiles des administrations. Cela implique d&apos;analyser la
					structure du site, la qualité du code, la conformité aux normes web,
					la sécurité des données, la disponibilité du service, etc.
				</li>
			</ol>
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
