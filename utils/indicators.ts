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
	}[];
	moreInfos_title?: string;
	moreInfos?: string;
	isMoreInfosBlue?: boolean;
}[];

export const indicatorsDescriptions: IndicatorDescriptions = [
	{
		slug: 'online',
		title:
			'Permet d’évaluer si la démarche est réalisable en ligne de bout en bout.',
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
					'La démarche est À venir d’être déployé sur tout le territoire.'
			},
			{
				label: 'Non',
				color: 'red',
				description: 'La démarche n’est pas encore possible en ligne.'
			},
			{
				label: 'Démarches proactive',
				color: 'blue',
				description:
					'L’administration a attribué automatiquement les droits aux bénéficiaires de la démarche.'
			}
		]
	},
	{
		slug: 'satisfaction',
		title: 'Reflète le niveau de satisfaction des usagers du service.',
		description:
			'Cette appréciation est calculée sur la base du recueil des l’avis déposés par les usagers grâce au bouton “je donne mon avis” qui se trouve à la fin de la démarche. Plus pécisément, cette appréciation correspond à une note moyenne calculée à partir de l’ensemble des réponses données par les usagers à la question : “ Comment s’est passée cette démarche pour vous ? ”.',
		indicators_intro:
			'Voici la corrélation entre cette note et les 3 niveaux d’appréciation :',
		indicators: [
			{
				label: 'Très bon',
				color: 'green',
				description: 'Moyenne des notes au dessus de 8/10'
			},
			{
				label: 'Moyen',
				color: 'yellow',
				description: 'Moyenne des notes entre 5 et 8/10'
			},
			{
				label: 'Mauvais',
				color: 'red',
				description: 'Moyenne inférieure à 5/10'
			},
			{
				label: 'À venir',
				color: 'gray',
				description: 'Le téléservice ne permet pas encore le recueil des avis'
			}
		],
		moreInfos_title: 'Nombre insuffisant d’avis',
		moreInfos:
			'La démarche n’a pas encore recueilli le minimum de 100 avis d’usagers pour que le calcul de cette note soit représentatif.',
		isMoreInfosBlue: false
	},
	{
		slug: 'handicap',
		title:
			'Mets en lumière le niveau de conformité du service numérique aux critères d’accessibilité (RGAA) déterminés par la loi.',
		description:
			'L’accessibilité numérique consiste à rendre les contenus et services numériques compréhensibles et utilisables par les personnes en situation de handicap.',
		indicators_intro:
			'Cet indicateur est donc évalué comme un taux de conformité aux critères du RGAA, il se décline selon 3 niveaux d’appréciation de la conformité :',
		indicators: [
			{
				label: 'Oui',
				color: 'green',
				description:
					'Le service a atteint un taux de 100% de conformité au RGAA'
			},
			{
				label: 'Partiel',
				color: 'yellow',
				description: 'Taux de conformité compris entre 50% à 99%'
			},
			{
				label: 'Non',
				color: 'red',
				description:
					'Le service déclare un taux de conformité au RGAA inférieur à 50% ou n’a pas de déclaration d’accessibilité'
			},
			{
				label: 'À venir',
				color: 'gray',
				description: "La prise en compte du handicap n'est pas encore évaluée"
			}
		]
	},
	{
		slug: 'dlnuf',
		title:
			"Simplifie les démarches des usagers, en leur évitant de fournir des informations ou des documents que l'Administration détient déjà.",
		indicators_intro: '5 niveaux d’évaluation :',
		indicators: [
			{
				label: 'Très bon',
				color: 'green',
				description:
					'Une quantité faible d’information est demandée aux usagers. Au moins 70% des informations sont pré-remplies.'
			},
			{
				label: 'Moyen',
				color: 'yellow',
				description:
					'Une partie seulement de la démarche peut être réalisée en ligne.'
			},
			{
				label: 'Mauvais',
				color: 'red',
				description:
					'Un grand nombre d’informations pourtant détenu par l’administration doit être à nouveau saisi. Ces informations peuvent être également difficile à trouver pour l’usager.'
			}
		],
		moreInfos_title: 'Démarches proactive',
		moreInfos:
			'L’administration a attribué automatiquement les droits aux bénéficiaires de la démarche. Aucune information n’est demandée à l’usager. L’administration a fourni 100% des informations nécessaires pour mettre en place le service pour l’usager.',
		isMoreInfosBlue: true
	},
	{
		slug: 'usage',
		title:
			'Mesure le taux d’utilisation du service numérique, par rapport à l’utilisation tout canaux confondus.',
		indicators_intro: '5 niveaux d’évaluation :',
		indicators: [
			{
				label: 'Totale',
				color: 'green',
				description: '100% des usagers ont utilisé le service en ligne'
			},
			{
				label: 'Élevée',
				color: 'green',
				description: 'Plus de 75 % des usagers ont utilisé le service en ligne'
			},
			{
				label: 'Moyenne',
				color: 'yellow',
				description:
					'Entre 75 % et 40% des usagers ont utilisé en service en ligne'
			},
			{
				label: 'Faible',
				color: 'red',
				description: 'Moins de 40% des usagers ont utilisé le service en ligne'
			},
			{
				label: 'Non applicable',
				color: 'gray',
				description:
					'Cet indicateur n’est pas pertinent pour le service en ligne (démarche non dématérialisée, ou existence de plusieurs services en ligne, etc.)'
			}
		]
	},
	{
		slug: 'simplicity',
		title:
			'Evalue le niveau de simplicité du langage employé par l’administration, selon les usagers.',
		description:
			'Cette note est calculée sur la base des retours usagers récoltés via le questionnaire de satisfaction (bouton “je donne mon avis”, qui se trouve à la fin de la démarche).',
		indicators_intro: '5 niveaux d’évaluation :',
		indicators: [
			{
				label: 'Très bon',
				color: 'green',
				description: 'Moyenne des notes au dessus de 8/10'
			},
			{
				label: 'Moyen',
				color: 'yellow',
				description: 'Moyenne des notes entre 5 et 8/10'
			},
			{
				label: 'Mauvais',
				color: 'red',
				description: 'Moyenne inférieure à 5/10'
			},
			{
				label: 'À venir',
				color: 'gray',
				description: 'Le téléservice ne permet pas encore le recueil des avis'
			}
		],
		moreInfos_title: 'Nombre insuffisant d’avis',
		moreInfos:
			'La démarche n’a pas encore recueilli le minimum de 100 avis d’usagers pour que le calcul de cette note soit représentatif.',
		isMoreInfosBlue: false
	},
	{
		slug: 'uptime',
		title:
			'Mesure le nombre d’usagers ayant eu besoin d’être accompagné par une aide extérieure au service afin de pouvoir réaliser leur démarche.',
		description:
			'Cette note est calculée sur la base des retours usagers récoltés via le questionnaire de satisfaction (bouton “je donne mon avis”, qui se trouve à la fin de la démarche). Cette évaluation correspond à la somme des usagers ayant répondu avoir eu l’intention de contacter le service mais qui n’aurait , soit pas réussi à trouver le moyen de le joindre ou pas pu faire aboutir cette prise de contact, cela sur le nombre total d’usagers ayant répondu au questionnaire.',
		indicators_intro: '5 niveaux d’évaluation :',
		indicators: [
			{
				label: 'Très bon',
				color: 'green',
				description:
					'Plus de 90 % des usagers n’ont pas eu besoin d’aide pour effectuer leur démarche.'
			},
			{
				label: 'Moyen',
				color: 'yellow',
				description: 'Moyenne des notes entre 5 et 8/10'
			},
			{
				label: 'Mauvais',
				color: 'red',
				description: 'Moyenne inférieure à 5/10'
			},
			{
				label: 'À venir',
				color: 'gray',
				description: 'Le téléservice ne permet pas encore le recueil des avis'
			}
		],
		moreInfos_title: 'Nombre insuffisant d’avis',
		moreInfos:
			'La démarche n’a pas encore recueilli le minimum de 100 avis d’usagers pour que le calcul de cette note soit représentatif.',
		isMoreInfosBlue: false
	},
	{
		slug: 'performance',
		title:
			'Mesure le nombre d’usagers ayant eu besoin d’être accompagné par une aide extérieure au service afin de pouvoir réaliser leur démarche.',
		description:
			'Cette note est calculée sur la base des retours usagers récoltés via le questionnaire de satisfaction (bouton “je donne mon avis”, qui se trouve à la fin de la démarche). Cette évaluation correspond à la somme des usagers ayant répondu avoir eu l’intention de contacter le service mais qui n’aurait , soit pas réussi à trouver le moyen de le joindre ou pas pu faire aboutir cette prise de contact, cela sur le nombre total d’usagers ayant répondu au questionnaire.',
		indicators_intro: '5 niveaux d’évaluation :',
		indicators: [
			{
				label: 'Très bon',
				color: 'green',
				description:
					'Plus de 90 % des usagers n’ont pas eu besoin d’aide pour effectuer leur démarche.'
			},
			{
				label: 'Moyen',
				color: 'yellow',
				description: 'Moyenne des notes entre 5 et 8/10'
			},
			{
				label: 'Mauvais',
				color: 'red',
				description: 'Moyenne inférieure à 5/10'
			},
			{
				label: 'À venir',
				color: 'gray',
				description: 'Le téléservice ne permet pas encore le recueil des avis'
			}
		],
		moreInfos_title: 'Nombre insuffisant d’avis',
		moreInfos:
			'La démarche n’a pas encore recueilli le minimum de 100 avis d’usagers pour que le calcul de cette note soit représentatif.',
		isMoreInfosBlue: false
	},
	{
		slug: 'auth',
		title:
			'Mesure le nombre d’usagers ayant eu besoin d’être accompagné par une aide extérieure au service afin de pouvoir réaliser leur démarche.',
		description:
			'Cette note est calculée sur la base des retours usagers récoltés via le questionnaire de satisfaction (bouton “je donne mon avis”, qui se trouve à la fin de la démarche). Cette évaluation correspond à la somme des usagers ayant répondu avoir eu l’intention de contacter le service mais qui n’aurait , soit pas réussi à trouver le moyen de le joindre ou pas pu faire aboutir cette prise de contact, cela sur le nombre total d’usagers ayant répondu au questionnaire.',
		indicators_intro: '5 niveaux d’évaluation :',
		indicators: [
			{
				label: 'Très bon',
				color: 'green',
				description:
					'Plus de 90 % des usagers n’ont pas eu besoin d’aide pour effectuer leur démarche.'
			},
			{
				label: 'Moyen',
				color: 'yellow',
				description: 'Moyenne des notes entre 5 et 8/10'
			},
			{
				label: 'Mauvais',
				color: 'red',
				description: 'Moyenne inférieure à 5/10'
			},
			{
				label: 'À venir',
				color: 'gray',
				description: 'Le téléservice ne permet pas encore le recueil des avis'
			}
		],
		moreInfos_title: 'Nombre insuffisant d’avis',
		moreInfos:
			'La démarche n’a pas encore recueilli le minimum de 100 avis d’usagers pour que le calcul de cette note soit représentatif.',
		isMoreInfosBlue: false
	}
];
