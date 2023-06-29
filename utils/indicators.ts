import { IndicatorColor, IndicatorSlug } from '@prisma/client';

type IndicatorDescriptions = {
	slug: IndicatorSlug;
	title: string;
	description?: string;
	indicators_intro: string;
	indicators: {
		label: string;
		color: IndicatorColor;
		description: string;
		noBackground?: boolean;
	}[];
	moreInfos_title?: string;
	moreInfos?: string;
	isMoreInfosBlue?: boolean;
}[];

export const indicatorsDescriptions: IndicatorDescriptions = [
	{
		slug: 'online',
		title: 'Évalue si la démarche ou le service est numérisé.',
		description:
			'Cet indicateur permet de mesurer la numérisation des démarches en répondant à trois questions : \n - La démarche est-elle entièrement réalisable en ligne ?\n - Est-elle disponible sur tout le territoire français ? \n - Est-elle ouverte à toutes et tous ?',
		indicators_intro: "5 niveaux d'évaluation :",
		indicators: [
			{
				label: 'Oui',
				color: 'green',
				description:
					'La totalité de la démarche est réalisable en ligne sur l’intégralité du territoire.'
			},
			{
				label: 'En cours de déploiement local',
				color: 'green',
				description:
					'La démarche est en cours de déploiement sur le territoire.'
			},
			{
				label: 'Partiel',
				color: 'yellow',
				description:
					'Une partie de la démarche n’est pas réalisable en ligne, n’est pas disponible sur l’intégralité du territoire français, ou n’est ouverte qu’à une partie de la population.'
			},
			{
				label: 'Non',
				color: 'red',
				description: 'La démarche n’est pas encore réalisable en ligne.'
			},
			{
				label: 'Démarche proactive',
				color: 'blue',
				description:
					'Grâce au partage d’informations entre administrations, ce service attribue automatiquement les droits aux personnes concernées.'
			}
		]
	},
	{
		slug: 'satisfaction',
		title: 'Évalue le niveau de satisfaction du service, par les usagers.',
		description:
			'Cette note de satisfaction est calculée sur la base des avis déposés sur la démarche par les usagers.',
		indicators_intro: "5 niveaux d'évaluation :",
		indicators: [
			{
				label: '8 / 10',
				color: 'green',
				description: 'Moyenne des notes au dessus de 8/10.'
			},
			{
				label: '5 / 10',
				color: 'yellow',
				description: 'Moyenne des notes entre 5 et 8/10.'
			},
			{
				label: '1 / 10',
				color: 'red',
				description: 'Moyenne inférieure à 5/10.'
			},
			{
				label: 'À venir',
				color: 'gray',
				noBackground: true,
				description: 'La démarche ne permet pas encore le recueil des avis.'
			},
			{
				label: "Nombre d'avis insuffisants",
				color: 'gray',
				noBackground: true,
				description:
					'La démarche n’a pas encore recueilli le minimum de 100 avis d’usagers pour que le calcul de cette note soit représentatif.'
			}
		],
		moreInfos_title: 'Méthode de calcul',
		moreInfos:
			'Pour calculer la note de satisfaction, nous réalisons une moyenne des réponses données à la question « Comment s’est passée cette démarche pour vous ? » en attribuant une note sur 10 à chaque option de réponses proposée dans le questionnaire.'
	},
	{
		slug: 'handicap',
		title:
			"Évalue le niveau d’accessibilité numérique d’un service.",
		description:
			'Il est basé sur le taux de conformité au Référentiel général d’amélioration de l’accessibilité (RGAA). Afin que ce critère soit pris en compte, une déclaration d’accessibilité doit être publiée et accessible depuis chaque page du service. Pour être recevable, cette déclaration doit respecter un certain nombre de critères : \n - Indiquer si le niveau d’accessibilité est totalement conforme, partiellement conforme ou non conforme, \n - Proposer un moyen de contact accessible aux personnes en situation de handicap, \n - S’appuyer sur un échantillon représentatif, \n - Afficher le taux global de conformité, \n - Ne pas être expirée (dernier audit il y a moins de 3 ans).',
		indicators_intro: "4 niveaux d'évaluation :",
		indicators: [
			{
				label: 'Oui',
				color: 'green',
				description:
					'Le service est 100% conforme au RGAA.'
			},
			{
				label: 'Partiel',
				color: 'yellow',
				description: 'Entre 50% et 99% de conformité au RGAA.'
			},
			{
				label: 'Non',
				color: 'red',
				description:
					'Moins de 50% de conformité au RGAA, ou aucune déclaration d’accessibilité, ou une déclaration ne respectant pas les critères ennoncés ci-dessus.'
			},
			{
				label: 'À venir',
				color: 'gray',
				noBackground: true,
				description: "La prise en compte du handicap n'est pas encore évaluée."
			}
		],
		moreInfos_title: 'Méthode de calcul',
		moreInfos:
			"Le taux de conformité au RGAA est déterminé à la suite d'un audit réalisé par un.e expert.e accessibilité."
	},
	{
		slug: 'dlnuf',
		title:
			'Évalue le taux de pré-remplissage des formulaires. Cela évite aux usagers de saisir des informations ou de fournir des pièces justificatives que d’autres administrations possèdent déjà.',
		description:
			"Le partage de données entre administrations permet d’éviter de redemander les mêmes informations et les mêmes pièces justificatives aux usagers. Ce principe, appelé “Dites-le nous une fois”, s'appuie sur l'utilisation d'APIs : des interfaces techniques entre deux entités qui permettent d'échanger certaines données détenues de manière sécurisée. Ce partage d’information est un principe consacré dans le code des relations entre le public et l’administration (CRPA) aux articles 114-8 et 114-9.",
		indicators_intro: '5 niveaux d’évaluation :',
		indicators: [
			{
				label: 'Optimal',
				color: 'green',
				description:
					'Un effort très faible est demandé aux usagers : aucune ou une seule information est requise.'
			},
			{
				label: 'Partiel',
				color: 'yellow',
				description:
					'Un effort modéré est demandé aux usagers : 2 à 4 informations sont requises.'
			},
			{
				label: 'Faible',
				color: 'red',
				description:
					'Un effort important est demandé aux usagers : plus de 4 informations sont requises.'
			},
			{
				label: 'Non applicable',
				color: 'gray',
				description: "Le critère ne s'applique pas à cette démarche."
			},
			{
				label: 'À venir',
				color: 'gray',
				noBackground: true,
				description: 'Le système de notation est en cours de réalisation.'
			}
		],
		moreInfos_title: 'Méthode de calcul',
		moreInfos:
			"Afin d’évaluer l’efficacité de ce pré-remplissage, nous comptons le nombre d’informations au sein de la démarche demandées par l'administration à l'usager qui pourraient être pré-remplies."
	},
	{
		slug: 'usage',
		title:
			'Mesure le taux d’utilisation du service numérique, par rapport à l’utilisation tous canaux confondus.',
		description:
			'Il s’agit d’un taux allant de 0 à 100%, calculé en divisant le nombre de réalisation du service par en ligne divisé par le nombre total de réalisation du service, sur une année glissante.',
		indicators_intro: '2 niveaux d’évaluation :',
		indicators: [
			{
				label: '50%',
				color: 'gray',
				description:
					"Taux d'utilisation de la version numérique de la démarche."
			},
			{
				label: 'À venir',
				color: 'gray',
				noBackground: true,
				description:
					"Le taux d'utilisation de la version numérique de la démarche est en cours d'analyse."
			}
		]
	},
	{
		slug: 'simplicity',
		title:
			'Evalue le niveau de simplicité du langage employé par l’administration, selon les usagers.',
		description:
			'Comme la note de satisfaction usager, cette note est calculée sur la base des retours usagers récoltés via le questionnaire de satisfaction (bouton « je donne mon avis », qui se trouve à la fin de la démarche).\n\n Plus précisément, cette appréciation correspond à une note moyenne calculée à partir de l’ensemble des réponses données par les usagers à la question : « Que pensez-vous du langage utilisé ? ».',
		indicators_intro: '5 niveaux d’évaluation :',
		indicators: [
			{
				label: '8 / 10',
				color: 'green',
				description: 'Moyenne des notes au dessus de 8/10.'
			},
			{
				label: '5 / 10',
				color: 'yellow',
				description: 'Moyenne des notes entre 5 et 8/10.'
			},
			{
				label: '1 / 10',
				color: 'red',
				description: 'Moyenne inférieure à 5/10.'
			},
			{
				label: 'À venir',
				color: 'gray',
				noBackground: true,
				description: 'La démarche ne permet pas encore le recueil des avis.'
			},
			{
				label: "Nombre d'avis insuffisants",
				color: 'gray',
				noBackground: true,
				description:
					'La démarche n’a pas encore recueilli le minimum de 100 avis d’usagers pour que le calcul de cette note soit représentatif.'
			}
		],
		moreInfos_title: 'Méthode de calcul',
		moreInfos:
			'Pour calculer la note de simplicité du langage, nous réalisons une moyenne des réponses données à la question « Que pensez-vous du langage utilisé ? » en attribuant une note /10 aux trois réponses proposées dans le questionnaire.',
		isMoreInfosBlue: false
	},
	{
		slug: 'help_reachable',
		title:
			'Examine le pourcentage des usagers déclarant n’ayant pas réussi à contacter le service pour recevoir de l’aide.',
		description:
			'Cet indicateur est récent et sera certainement en cours de calcul. La mention «À venir» est alors visible dans l’attente d’un minimum de 100 votes.\n\n Cette évaluation est issue des réponses des usagers à la question «Avez-vous tenté de contacter le service pour de l’aide ?». Question présente dans le formulaire de satisfaction «je donne mon avis», qui se trouve à la fin de la démarche.',
		indicators_intro: "2 niveaux d'évaluation :",
		indicators: [
			{
				label: '50%',
				color: 'gray',
				description:
					"Pourcentage d'usagers n'ayant pas réussi à contacter le service."
			},
			{
				label: 'À venir',
				color: 'gray',
				noBackground: true,
				description:
					"L'accès à une aide joignable et efficace n'est pas encore évaluée."
			}
		],
		moreInfos_title: 'Méthode de calcul',
		moreInfos:
			'Cette évaluation correspond à la somme des usagers ayant répondu, avoir eu l’intention de contacter le service mais qui n’aurait , soit pas réussi à trouver le moyen de le joindre ou pas pu faire aboutir cette prise de contact, cela sur le nombre total d’usagers ayant répondu au questionnaire.'
	},
	{
		slug: 'help_used',
		title:
			'Mesure le nombre d’usagers ayant eu besoin d’être accompagné par une aide extérieure au service afin de pouvoir réaliser leur démarche.',
		description:
			'Cet indicateur est récent et sera certainement en cours de calcul. La mention «À venir» est alors visible dans l’attente d’un minimum de 100 votes.',
		indicators_intro: "2 niveaux d'évaluation :",
		indicators: [
			{
				label: '50%',
				color: 'gray',
				description: "Pourcentage d'usagers ayant eu besoin d'être accompagnés."
			},
			{
				label: 'À venir',
				color: 'gray',
				noBackground: true,
				description: "Le niveau d'autonomie n'est pas encore évalué."
			}
		],
		moreInfos_title: 'Méthode de calcul',
		moreInfos:
			'Comme la note de satisfaction usager, cette note est calculée sur la base des retours usagers récoltés via le questionnaire de satisfaction (bouton «je donne mon avis», qui se trouve à la fin de la démarche).'
	},
	{
		slug: 'uptime',
		title:
			'Indique le niveau moyen de disponibilité d’un service en ligne, sur une période donnée.',
		description:
			'Un service numérique peut ne plus être disponible pour des raisons de maintenance, de mises à jour, de surcharge des serveurs ou de tout autres problèmes techniques. C’est ce temps durant lequel l’usager ne peut avoir accès au service qui est ici analysé.\n\n Afin d’estimer le temps pendant lequel un service est disponible ou non, des tests sont réalisés par un outil qui interroge 24 heures sur 24 les adresses URL des sites afin de calculer les niveaux de disponibilité et de temps de réponse.',
		indicators_intro: '4 niveaux d’évaluation :',
		indicators: [
			{
				label: 'Optimal',
				color: 'green',
				description: 'Taux de disponibilité supérieur à 99.9%.'
			},
			{
				label: 'Partiel',
				color: 'yellow',
				description: 'Taux de disponibilité compris entre 98.5% et 99.9%.'
			},
			{
				label: 'Faible',
				color: 'red',
				description: 'Taux de disponibilité inférieur à 98.5%.'
			},
			{
				label: 'À venir',
				color: 'gray',
				noBackground: true,
				description:
					"La taux de disponibilité de la démarche n'est pas encore évalué."
			}
		],
		moreInfos_title: 'Méthode de calcul',
		moreInfos:
			"On obtient ce taux de disponibilité en divisant la durée durant laquelle ledit service est opérationnel par la durée totale durant laquelle on aurait souhaité qu'il le soit. Cet indicateur est calculé sur une durée de 3 mois précédant la publication de l’Observatoire."
	},
	{
		slug: 'performance',
		title:
			'Mesure le temps moyen que met une page à s’afficher pour un usager, quelle que soit la qualité de la couverture réseau.',
		indicators_intro: '4 niveaux d’évaluation :',
		indicators: [
			{
				label: 'Optimal',
				color: 'green',
				description: 'Temps de chargement des pages inférieur à 0.4s.'
			},
			{
				label: 'Partiel',
				color: 'yellow',
				description: 'Temps de chargement des pages compris entre 0.4s et 0.8s.'
			},
			{
				label: 'Faible',
				color: 'red',
				description: 'Temps de chargement des pages supérieur à 0.8s.'
			},
			{
				label: 'À venir',
				color: 'gray',
				noBackground: true,
				description:
					"Le temps de chargement des pages de la démarche n'est pas encore évalué."
			}
		],
		moreInfos_title: 'Méthode de calcul',
		moreInfos:
			'Afin de calculer cette vitesse d’affichage d’une page (ou “temps de réponse d’une page”), des tests sont réalisés par un outil automatique qui interroge 24 heures sur 24 les adresses URL des sites afin de calculer ce temps de réponse.'
	},
	{
		slug: 'auth',
		title:
			'Indique si le service en ligne est équipé ou non de FranceConnect ou FranceConnect+.',
		description:
			"Le bouton FranceConnect est la solution de l'État pour faciliter la connexion à vos services et démarches en ligne. Il permet d'accéder à plus de 1400 services en utilisant un compte et un mot de passe que vous possédez déjà.",
		indicators_intro: '5 niveaux d’évaluation :',
		indicators: [
			{
				label: 'FranceConnect',
				color: 'blue',
				description: 'Le service est équipé du dispositif FranceConnect.'
			},
			{
				label: 'FranceConnect+',
				color: 'blue',
				description: 'Le service est équipé du dispositif FranceConnect+.'
			},
			{
				label: 'Non',
				color: 'red',
				description:
					'Le service n’est équipé ni du dispositif FranceConnect ni du dispositif FranceConnect+.'
			},
			{
				label: 'Non applicable',
				color: 'gray',
				description:
					'L’authentification par le bouton FranceConnect n’est pas pertinente.'
			},
			{
				label: 'À venir',
				color: 'gray',
				noBackground: true,
				description:
					"L'implémentation de l'authentification FranceConnect n'est pas encore évaluée."
			}
		]
	}
];
