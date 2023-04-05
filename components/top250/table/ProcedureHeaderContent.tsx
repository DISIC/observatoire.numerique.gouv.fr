import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { IndicatorSlug } from '@prisma/client';
import { IndicatorLabel } from './IndicatorLabel';
import { fr } from '@codegouvfr/react-dsfr';

type Props = {
	slug: IndicatorSlug;
};

export const ProcedureHeaderContent = (props: Props) => {
	const { slug } = props;
	const { classes, cx } = useStyles();

	let output = <>À rédiger</>;

	switch (slug) {
		case 'online':
			output = (
				<div className={cx(classes.root)}>
					<h5>
						Permet d’évaluer si la démarche est réalisable en ligne de bout en
						bout.
					</h5>
					<p>
						<b>5 niveaux d’évaluation :</b>
					</p>
					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Oui" color="green" />
						</span>
						<span>
							La totalité de la démarche est réalisable en ligne sur
							l’intégralité du territoire.
						</span>
					</p>
					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel
								label="En cours de déploiement local"
								color="green"
							/>
						</span>
						<span>
							La démarche est en attente d’être déployé sur tout le territoire.
						</span>
					</p>

					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Non" color="red" />
						</span>
						<span>La démarche n’est pas encore possible en ligne.</span>
					</p>
					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Démarches proactive" color="blue" />
						</span>
						<span>
							L’administration a attribué automatiquement les droits aux
							bénéficiaires de la démarche.
						</span>
					</p>
					<p className={classes.moreInfos}>
						<b>Nombre insuffisant d’avis</b>
						<p>
							La démarche n’a pas encore recueilli le minimum de 100 avis
							d’usagers pour que le calcul de cette note soit représentatif.
						</p>
					</p>
				</div>
			);
			break;
		case 'satisfaction':
			output = (
				<div className={cx(classes.root)}>
					<h5>Reflète le niveau de satisfaction des usagers du service.</h5>
					<p>
						Cette appréciation est calculée sur la base du recueil des l’avis
						déposés par les usagers <u>grâce au bouton “je donne mon avis”</u>{' '}
						qui se trouve à la fin de la démarche. Plus pécisément, cette
						appréciation correspond à une note moyenne calculée à partir de
						l’ensemble des réponses données par les usagers à la question : “
						Comment s’est passée cette démarche pour vous ? ”.
					</p>
					<p>
						<b>
							Voici la corrélation entre cette note et les 3 niveaux
							d’appréciation :
						</b>
					</p>
					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Très bon" color="green" />
						</span>
						<span>Moyenne des notes au dessus de 8/10</span>
					</p>
					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Moyen" color="yellow" />
						</span>
						<span>Moyenne des notes entre 5 et 8/10</span>
					</p>

					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Mauvais" color="red" />
						</span>
						<span>Moyenne inférieure à 5/10</span>
					</p>
					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="En attente" color="blue" />
						</span>
						<span>Le téléservice ne permet pas encore le recueil des avis</span>
					</p>
					<p className={classes.moreInfos}>
						<b>Nombre insuffisant d’avis</b>
						<p>
							La démarche n’a pas encore recueilli le minimum de 100 avis
							d’usagers pour que le calcul de cette note soit représentatif.
						</p>
					</p>
				</div>
			);
			break;

		case 'handicap':
			output = (
				<div className={cx(classes.root)}>
					<h5>
						Mets en lumière le niveau de conformité du service numérique aux
						critères d’accessibilité (RGAA) déterminés par la loi.
					</h5>
					<p>
						L’accessibilité numérique consiste à rendre les contenus et services
						numériques compréhensibles et utilisables par les personnes en
						situation de handicap.
					</p>
					<p>
						<b>
							Cet indicateur est donc évalué comme un taux de conformité aux
							critères du RGAA, il se décline selon 3 niveaux d’appréciation de
							la conformité :
						</b>
					</p>
					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Oui" color="green" />
						</span>
						<span>
							Le service a atteint un taux de 100% de conformité au RGAA
						</span>
					</p>
					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Partielle" color="yellow" />
						</span>
						<span>Taux de conformité compris entre 50% à 99%</span>
					</p>

					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Non" color="red" />
						</span>
						<span>
							Le service déclare un taux de conformité au RGAA inférieur à 50%
							ou n’a pas de déclaration d’accessibilité
						</span>
					</p>
				</div>
			);
			break;

		case 'dlnuf':
			output = (
				<div className={cx(classes.root)}>
					<h5>
						Simplifie les démarches des usagers, en leur évitant de fournir des
						informations ou des documents que l'Administration détient déjà.
					</h5>
					<p>
						<b>5 niveaux d’évaluation :</b>
					</p>
					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Très bon" color="green" />
						</span>
						<span>
							Une quantité faible d’information est demandée aux usagers. Au
							moins 70% des informations sont pré-remplies.
						</span>
					</p>
					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Moyen" color="yellow" />
						</span>
						<span>
							Une partie seulement de la démarche peut être réalisée en ligne.
						</span>
					</p>

					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Mauvais" color="red" />
						</span>
						<span>
							Un grand nombre d’informations pourtant détenu par
							l’administration doit être à nouveau saisi. Ces informations
							peuvent être également difficile à trouver pour l’usager.
						</span>
					</p>
					<p className={cx(classes.moreInfos, classes.moreInfosBlue)}>
						<b>Démarches proactive</b>
						<p>
							L’administration a attribué automatiquement les droits aux
							bénéficiaires de la démarche. Aucune information n’est demandée à
							l’usager. L’administration a fourni 100% des informations
							nécessaires pour mettre en place le service pour l’usager.
						</p>
					</p>
				</div>
			);
			break;

		case 'usage':
			output = (
				<div className={cx(classes.root)}>
					<h5>
						Mesure le taux d’utilisation du service numérique, par rapport à
						l’utilisation tout canaux confondus.
					</h5>
					<p>
						<b>5 niveaux d’évaluation :</b>
					</p>
					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Totale" color="green" />
						</span>
						<span>100% des usagers ont utilisé le service en ligne</span>
					</p>
					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Élevée" color="green" />
						</span>
						<span>
							Plus de 75 % des usagers ont utilisé le service en ligne
						</span>
					</p>
					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Moyenne" color="yellow" />
						</span>
						<span>
							Entre 75 % et 40% des usagers ont utilisé en service en ligne
						</span>
					</p>

					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Faible" color="red" />
						</span>
						<span>
							Moins de 40% des usagers ont utilisé le service en ligne
						</span>
					</p>
					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="En attente" color="blue" />
						</span>
						<span>
							Cet indicateur n’a pas encore pu être testé. Un test devrait être
							conduit dans les plus brefs délais
						</span>
					</p>
					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Non applicable" color="gray" />
						</span>
						<span>
							Cet indicateur n’est pas pertinent pour le service en ligne
							(démarche non dématérialisée, ou existence de plusieurs services
							en ligne, etc.)
						</span>
					</p>
				</div>
			);
			break;

		case 'simplicity':
			output = (
				<div className={cx(classes.root)}>
					<h5>
						Evalue le niveau de simplicité du langage employé par
						l’administration, selon les usagers.
					</h5>
					<p>
						Cette note est calculée sur la base des retours usagers récoltés via
						le questionnaire de satisfaction (bouton “je donne mon avis”, qui se
						trouve à la fin de la démarche).
					</p>
					<p>
						<b>5 niveaux d’évaluation :</b>
					</p>
					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Très bon" color="green" />
						</span>
						<span>Moyenne des notes supérieure à 8/10</span>
					</p>
					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Moyen" color="yellow" />
						</span>
						<span>Moyenne des notes comrpise entre 5 et 8/10</span>
					</p>

					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Mauvais" color="red" />
						</span>
						<span>Moyenne inférieure à 5/10</span>
					</p>
					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="En attente" color="blue" />
						</span>
						<span>
							Cet indicateur n’a pas encore pu être testé. Un test devrait être
							conduit dans les plus brefs délais.
						</span>
					</p>
					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Non applicable" color="gray" />
						</span>
						<span>
							Cet indicateur n’est pas pertinent pour le service en ligne
							(démarche non dématérialisée, ou existence de plusieurs services
							en ligne, etc.)
						</span>
					</p>
					<p className={cx(classes.moreInfos)}>
						<b>Nombre insuffisant d’avis</b>
						<p>
							La démarche n’a pas encore recueilli le minimum de 100 avis
							d’usagers pour que le calcul de cette note soit représentatif.
						</p>
					</p>
				</div>
			);
			break;

		case 'uptime':
			output = (
				<div className={cx(classes.root)}>
					<h5>
						Mesure le nombre d’usagers ayant eu besoin d’être accompagné par une
						aide extérieure au service afin de pouvoir réaliser leur démarche.
					</h5>
					<p>
						Cette note est calculée sur la base des retours usagers récoltés via
						le questionnaire de satisfaction (bouton “je donne mon avis”, qui se
						trouve à la fin de la démarche). Cette évaluation correspond à la
						somme des usagers ayant répondu avoir eu l’intention de contacter le
						service mais qui n’aurait , soit pas réussi à trouver le moyen de le
						joindre ou pas pu faire aboutir cette prise de contact, cela sur le
						nombre total d’usagers ayant répondu au questionnaire.
					</p>
					<p>
						<b>5 niveaux d’évaluation :</b>
					</p>
					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Très bon" color="green" />
						</span>
						<span>
							Plus de 90 % des usagers n’ont pas eu besoin d’aide pour effectuer
							leur démarche.
						</span>
					</p>
					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Moyen" color="yellow" />
						</span>
						<span>
							Entre 15% et 35 % des usagers on eu besoin d’un acompagnement pour
							effectuer leur démarche
						</span>
					</p>

					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Mauvais" color="red" />
						</span>
						<span>
							Plus de 35 % des usagers ont eu recours à une aide pour effectuer
							leur démarche.
						</span>
					</p>
					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="En attente" color="blue" />
						</span>
						<span>
							Cet indicateur n’a pas encore pu être testé. Un test devrait être
							conduit dans les plus brefs délais.
						</span>
					</p>
					<p className={classes.indicatorContainer}>
						<span className={cx(classes.label)}>
							<IndicatorLabel label="Non applicable" color="gray" />
						</span>
						<span>
							Cet indicateur n’est pas pertinent pour le service en ligne
							(démarche non dématérialisée, ou existence de plusieurs services
							en ligne, etc.)
						</span>
					</p>
					<p className={classes.moreInfos}>
						<b>Nombre insuffisant d’avis</b>
						<p>
							La démarche n’a pas encore recueilli le minimum de 100 avis
							d’usagers pour que le calcul de cette note soit représentatif.
						</p>
					</p>
				</div>
			);
			break;
	}

	return <div>{output}</div>;
};

const useStyles = makeStyles()(theme => ({
	root: {
		h5: {
			fontSize: '20px'
		},
		p: {
			fontSize: '14px'
		}
	},
	label: {
		marginRight: fr.spacing('2v')
	},
	indicatorContainer: {
		marginBottom: fr.spacing('4v'),
		display: 'flex',
		['& > span:first-child']: {
			flexShrink: 0
		}
	},
	moreInfos: {
		padding: fr.spacing('2v'),
		marginTop: fr.spacing('6v'),
		backgroundColor: theme.decisions.background.default.grey.hover,
		p: {
			marginBottom: 0
		}
	},
	moreInfosBlue: {
		backgroundColor: theme.decisions.background.contrast.info.default,
		b: {
			color: theme.decisions.background.flat.info.default
		}
	}
}));
