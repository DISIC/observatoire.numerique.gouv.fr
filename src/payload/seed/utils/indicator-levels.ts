import {
	PayloadIndicatorLevel,
	PayloadIndicator
} from '@/payload/payload-types';

type IndicatorLevelWithoutSystemFields = Omit<
	PayloadIndicatorLevel,
	'id' | 'createdAt' | 'updatedAt' | 'indicator'
>;

export const indicatorLevels: Record<
	PayloadIndicator['slug'],
	IndicatorLevelWithoutSystemFields[]
> = {
	online: [
		{
			label: 'Oui',
			color: 'green',
			description:
				'La totalité de la démarche est réalisable en ligne sur l’intégralité du territoire.',
			position: 1
		},
		{
			label: 'En cours de déploiement local',
			color: 'green',
			description: 'La démarche est en cours de déploiement sur le territoire.',
			position: 2
		},
		{
			label: 'Partiel',
			color: 'yellow',
			description:
				'Une partie de la démarche n’est pas réalisable en ligne, n’est pas disponible sur l’intégralité du territoire français, ou n’est ouverte qu’à une partie de la population.',
			position: 3
		},
		{
			label: 'Non',
			color: 'red',
			description: 'La démarche n’est pas encore réalisable en ligne.',
			position: 4
		},
		{
			label: 'Démarche proactive',
			color: 'blue',
			description:
				'Grâce au partage d’informations entre administrations, ce service attribue automatiquement les droits aux personnes concernées.',
			position: 5
		}
	],
	satisfaction: [
		{
			label: 'X / 10',
			color: 'green',
			description: 'Moyenne des notes au dessus de 8/10.',
			position: 1,
			threshold: 8,
			goal_reached: true
		},
		{
			label: 'X / 10',
			color: 'yellow',
			description: 'Moyenne des notes entre 5 et 8/10.',
			position: 2,
			threshold: 5,
			goal_reached: false
		},
		{
			label: 'X / 10',
			color: 'red',
			description: 'Moyenne inférieure à 5/10.',
			position: 3,
			threshold: 0,
			goal_reached: false
		},
		{
			label: 'À venir',
			color: 'gray',
			noBackground: true,
			description: 'La démarche ne permet pas encore le recueil des avis.',
			position: 4,
			goal_reached: false
		},
		{
			label: 'Nombre d’avis insuffisants',
			color: 'gray',
			noBackground: true,
			description:
				'La démarche n’a pas encore recueilli le minimum de 100 avis d’usagers pour que le calcul de cette note soit représentatif.',
			position: 5,
			goal_reached: false
		}
	],
	handicap: [
		{
			label: 'Oui',
			color: 'green',
			description: 'Le service est 100% conforme au RGAA.',
			position: 1,
			threshold: 100,
			goal_reached: true
		},
		{
			label: 'Partiel',
			color: 'yellow',
			description: 'Entre 50% et 99% de conformité au RGAA.',
			position: 2,
			threshold: 50,
			goal_reached: false
		},
		{
			label: 'Non',
			color: 'red',
			description:
				'Moins de 50% de conformité au RGAA, ou aucune déclaration d’accessibilité, ou une déclaration ne respectant pas les critères ennoncés ci-dessus.',
			position: 3,
			threshold: 0,
			goal_reached: false
		},
		{
			label: 'À venir',
			color: 'gray',
			noBackground: true,
			description: 'La prise en compte du handicap n’est pas encore évaluée.',
			position: 4,
			goal_reached: false
		}
	],
	dlnuf: [
		{
			label: 'Optimal',
			color: 'green',
			description:
				'Un effort très faible est demandé aux usagers : aucune ou une seule information est requise.',
			position: 1,
			threshold: 0,
			goal_reached: true
		},
		{
			label: 'Partiel',
			color: 'yellow',
			description:
				'Un effort modéré est demandé aux usagers : 2 à 4 informations sont requises.',
			position: 2,
			threshold: 2,
			goal_reached: false
		},
		{
			label: 'Faible',
			color: 'red',
			description:
				'Un effort important est demandé aux usagers : plus de 4 informations sont requises.',
			position: 3,
			threshold: 5,
			goal_reached: false
		},
		{
			label: 'Non applicable',
			color: 'gray',
			description: "Le critère ne s'applique pas à cette démarche.",
			position: 4,
			goal_reached: false
		},
		{
			label: 'À venir',
			color: 'gray',
			noBackground: true,
			description: 'Le système de notation est en cours de réalisation.',
			position: 5,
			goal_reached: false
		}
	],
	usage: [
		{
			label: 'XX%',
			color: 'gray',
			description: "Taux d'utilisation de la version numérique de la démarche.",
			position: 1,
			threshold: 0
		},
		{
			label: 'À venir',
			color: 'gray',
			noBackground: true,
			description:
				"Le taux d'utilisation de la version numérique de la démarche est en cours d'analyse.",
			position: 2
		}
	],
	simplicity: [
		{
			label: 'X / 10',
			color: 'green',
			description: 'Moyenne des notes au dessus de 8/10.',
			position: 1,
			threshold: 8,
			goal_reached: true
		},
		{
			label: 'X / 10',
			color: 'yellow',
			description: 'Moyenne des notes entre 5 et 8/10.',
			position: 2,
			threshold: 5,
			goal_reached: false
		},
		{
			label: 'X / 10',
			color: 'red',
			description: 'Moyenne inférieure à 5/10.',
			position: 3,
			threshold: 0,
			goal_reached: false
		},
		{
			label: 'À venir',
			color: 'gray',
			noBackground: true,
			description: 'La démarche ne permet pas encore le recueil des avis.',
			position: 4,
			goal_reached: false
		},
		{
			label: 'Nombre d’avis insuffisants',
			color: 'gray',
			noBackground: true,
			description:
				'La démarche n’a pas encore recueilli le minimum de 100 avis d’usagers pour que le calcul de cette note soit représentatif.',
			position: 5,
			goal_reached: false
		}
	],
	help_reachable: [
		{
			label: 'XX %',
			color: 'green',
			description:
				"85% des usagers ou plus ont réussi à joindre l'administration en la contactant",
			position: 1,
			threshold: 85,
			goal_reached: true
		},
		{
			label: 'XX %',
			color: 'yellow',
			description:
				"Entre 70% (inclus) et 85% (exclu) des usagers ont réussi à joindre l'administration en la contactant",
			position: 2,
			threshold: 70,
			goal_reached: false
		},
		{
			label: 'XX %',
			color: 'red',
			description:
				"Moins de 70% des usagers ont réussi à joindre l'administration en la contactant",
			position: 3,
			threshold: 0,
			goal_reached: false
		},
		{
			label: 'À venir',
			color: 'gray',
			description: 'La démarche ne permet pas encore le recueil des avis',
			position: 4,
			noBackground: false,
			goal_reached: false
		},
		{
			label: "Nombre d'avis insuffisant",
			color: 'gray',
			description:
				"Le service n'a pas recueilli le minimum de 100 avis pour que le taux soit représentatif",
			position: 5,
			noBackground: false,
			goal_reached: false
		}
	],
	help_efficient: [
		{
			label: 'X / 10',
			color: 'green',
			description: 'La moyenne des notes est supérieure ou égale à 8/10',
			position: 1,
			threshold: 8,
			goal_reached: true
		},
		{
			label: 'X / 10',
			color: 'yellow',
			description:
				'La moyenne des notes est comprise entre 5/10 (inclus) et 8/10 (exclu)',
			position: 2,
			threshold: 5,
			goal_reached: false
		},
		{
			label: 'X / 10',
			color: 'red',
			description: 'La moyenne des notes est inférieure à 5/10',
			position: 3,
			threshold: 0,
			goal_reached: false
		},
		{
			label: 'À venir',
			color: 'gray',
			description: 'La démarche ne permet pas encore le recueil des avis',
			position: 4,
			noBackground: false,
			goal_reached: false
		},
		{
			label: "Nombre d'avis insuffisant",
			color: 'gray',
			description:
				"Le service n'a pas recueilli le minimum de 100 avis pour que le taux soit représentatif",
			position: 5,
			noBackground: false,
			goal_reached: false
		}
	],
	help_used: [
		{
			label: 'XX%',
			color: 'gray',
			description: "Pourcentage d'usagers ayant eu besoin d'être accompagnés.",
			position: 1,
			threshold: 0
		},
		{
			label: 'À venir',
			color: 'gray',
			noBackground: true,
			description: "Le niveau d'autonomie n'est pas encore évalué.",
			position: 2
		}
	],
	uptime: [
		{
			label: 'Optimal',
			color: 'green',
			description: 'Taux de disponibilité supérieur à 99.9%.',
			position: 1,
			threshold: 99.9,
			goal_reached: true
		},
		{
			label: 'Partiel',
			color: 'yellow',
			description: 'Taux de disponibilité compris entre 98.5% et 99.9%.',
			position: 2,
			threshold: 98.5,
			goal_reached: false
		},
		{
			label: 'Faible',
			color: 'red',
			description: 'Taux de disponibilité inférieur à 98.5%.',
			position: 3,
			threshold: 0,
			goal_reached: false
		},
		{
			label: 'À venir',
			color: 'gray',
			noBackground: true,
			description:
				"Le taux de disponibilité de la démarche n'est pas encore évalué.",
			position: 4,
			goal_reached: false
		}
	],
	performance: [
		{
			label: 'Optimal',
			color: 'green',
			description: 'Temps de chargement des pages inférieur à 0.4s.',
			position: 1,
			threshold: 0,
			goal_reached: true
		},
		{
			label: 'Partiel',
			color: 'yellow',
			description: 'Temps de chargement des pages compris entre 0.4s et 0.8s.',
			position: 2,
			threshold: 400,
			goal_reached: false
		},
		{
			label: 'Faible',
			color: 'red',
			description: 'Temps de chargement des pages supérieur à 0.8s.',
			position: 3,
			threshold: 800,
			goal_reached: false
		},
		{
			label: 'À venir',
			color: 'gray',
			noBackground: true,
			description:
				"Le temps de chargement des pages de la démarche n'est pas encore évalué.",
			position: 4,
			goal_reached: false
		}
	],
	auth: [
		{
			label: 'FranceConnect',
			color: 'blue',
			description: 'Le service est équipé du dispositif FranceConnect.',
			position: 1,
			goal_reached: true
		},
		{
			label: 'FranceConnect +',
			color: 'blue',
			description: 'Le service est équipé du dispositif FranceConnect+.',
			position: 2,
			goal_reached: true
		},
		{
			label: 'Non',
			color: 'red',
			description:
				'Le service n’est équipé ni du dispositif FranceConnect ni du dispositif FranceConnect+.',
			position: 3,
			goal_reached: false
		},
		{
			label: 'Non applicable',
			color: 'gray',
			description:
				'L’authentification par le bouton FranceConnect n’est pas pertinente.',
			position: 4,
			goal_reached: false
		},
		{
			label: 'À venir',
			color: 'gray',
			noBackground: true,
			description:
				"L'implémentation de l'authentification FranceConnect n'est pas encore évaluée.",
			position: 5,
			goal_reached: false
		}
	]
};
