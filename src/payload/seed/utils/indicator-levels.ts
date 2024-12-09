import { PayloadIndicatorLevel, PayloadIndicator } from '@/payload/payload-types';

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
			label: '8 / 10',
			color: 'green',
			description: 'Moyenne des notes au dessus de 8/10.',
			position: 1
		},
		{
			label: '5 / 10',
			color: 'yellow',
			description: 'Moyenne des notes entre 5 et 8/10.',
			position: 2
		},
		{
			label: '1 / 10',
			color: 'red',
			description: 'Moyenne inférieure à 5/10.',
			position: 3
		},
		{
			label: 'À venir',
			color: 'gray',
			noBackround: true,
			description: 'La démarche ne permet pas encore le recueil des avis.',
			position: 4
		},
		{
			label: 'Nombre d’avis insuffisants',
			color: 'gray',
			noBackround: true,
			description:
				'La démarche n’a pas encore recueilli le minimum de 100 avis d’usagers pour que le calcul de cette note soit représentatif.',
			position: 5
		}
	],
	handicap: [
		{
			label: 'Oui',
			color: 'green',
			description: 'Le service est 100% conforme au RGAA.',
			position: 1
		},
		{
			label: 'Partiel',
			color: 'yellow',
			description: 'Entre 50% et 99% de conformité au RGAA.',
			position: 2
		},
		{
			label: 'Non',
			color: 'red',
			description:
				'Moins de 50% de conformité au RGAA, ou aucune déclaration d’accessibilité, ou une déclaration ne respectant pas les critères ennoncés ci-dessus.',
			position: 3
		},
		{
			label: 'À venir',
			color: 'gray',
			noBackround: true,
			description: 'La prise en compte du handicap n’est pas encore évaluée.',
			position: 4
		}
	],
	dlnuf: [
		{
			label: 'Optimal',
			color: 'green',
			description:
				'Un effort très faible est demandé aux usagers : aucune ou une seule information est requise.',
			position: 1
		},
		{
			label: 'Partiel',
			color: 'yellow',
			description:
				'Un effort modéré est demandé aux usagers : 2 à 4 informations sont requises.',
			position: 2
		},
		{
			label: 'Faible',
			color: 'red',
			description:
				'Un effort important est demandé aux usagers : plus de 4 informations sont requises.',
			position: 3
		},
		{
			label: 'Non applicable',
			color: 'gray',
			description: "Le critère ne s'applique pas à cette démarche.",
			position: 4
		},
		{
			label: 'À venir',
			color: 'gray',
			noBackround: true,
			description: 'Le système de notation est en cours de réalisation.',
			position: 5
		}
	],
	usage: [
		{
			label: '50%',
			color: 'gray',
			description: "Taux d'utilisation de la version numérique de la démarche.",
			position: 1
		},
		{
			label: 'À venir',
			color: 'gray',
			noBackround: true,
			description:
				"Le taux d'utilisation de la version numérique de la démarche est en cours d'analyse.",
			position: 2
		}
	],
	simplicity: [
		// 8 / 10
		{
			label: '8 / 10',
			color: 'green',
			description: 'Moyenne des notes au dessus de 8/10.',
			position: 1
		},
		{
			label: '5 / 10',
			color: 'yellow',
			description: 'Moyenne des notes entre 5 et 8/10.',
			position: 2
		},
		{
			label: '1 / 10',
			color: 'red',
			description: 'Moyenne inférieure à 5/10.',
			position: 3
		},
		{
			label: 'À venir',
			color: 'gray',
			noBackround: true,
			description: 'La démarche ne permet pas encore le recueil des avis.',
			position: 4
		},
		{
			label: 'Nombre d’avis insuffisants',
			color: 'gray',
			noBackround: true,
			description:
				'La démarche n’a pas encore recueilli le minimum de 100 avis d’usagers pour que le calcul de cette note soit représentatif.',
			position: 5
		}
	],
	help_reachable: [
		{
			label: '50%',
			color: 'gray',
			description:
				"Pourcentage d'usagers n'ayant pas réussi à contacter le service.",
			position: 1
		},
		{
			label: 'À venir',
			color: 'gray',
			noBackround: true,
			description:
				"L'accès à une aide joignable et efficace n'est pas encore évaluée.",
			position: 2
		}
	],
	help_used: [
		{
			label: '50%',
			color: 'gray',
			description: "Pourcentage d'usagers ayant eu besoin d'être accompagnés.",
			position: 1
		},
		{
			label: 'À venir',
			color: 'gray',
			noBackround: true,
			description: "Le niveau d'autonomie n'est pas encore évalué.",
			position: 2
		}
	],
	uptime: [
		{
			label: 'Optimal',
			color: 'green',
			description: 'Taux de disponibilité supérieur à 99.9%.',
			position: 1
		},
		{
			label: 'Partiel',
			color: 'yellow',
			description: 'Taux de disponibilité compris entre 98.5% et 99.9%.',
			position: 2
		},
		{
			label: 'Faible',
			color: 'red',
			description: 'Taux de disponibilité inférieur à 98.5%.',
			position: 3
		},
		{
			label: 'À venir',
			color: 'gray',
			noBackround: true,
			description:
				"Le taux de disponibilité de la démarche n'est pas encore évalué.",
			position: 4
		}
	],
	performance: [
		{
			label: 'Optimal',
			color: 'green',
			description: 'Temps de chargement des pages inférieur à 0.4s.',
			position: 1
		},
		{
			label: 'Partiel',
			color: 'yellow',
			description: 'Temps de chargement des pages compris entre 0.4s et 0.8s.',
			position: 2
		},
		{
			label: 'Faible',
			color: 'red',
			description: 'Temps de chargement des pages supérieur à 0.8s.',
			position: 3
		},
		{
			label: 'À venir',
			color: 'gray',
			noBackround: true,
			description:
				"Le temps de chargement des pages de la démarche n'est pas encore évalué.",
			position: 4
		}
	],
	auth: [
		{
			label: 'FranceConnect',
			color: 'blue',
			description: 'Le service est équipé du dispositif FranceConnect.',
			position: 1
		},
		{
			label: 'FranceConnect+',
			color: 'blue',
			description: 'Le service est équipé du dispositif FranceConnect+.',
			position: 2
		},
		{
			label: 'Non',
			color: 'red',
			description:
				'Le service n’est équipé ni du dispositif FranceConnect ni du dispositif FranceConnect+.',
			position: 3
		},
		{
			label: 'Non applicable',
			color: 'gray',
			description:
				'L’authentification par le bouton FranceConnect n’est pas pertinente.',
			position: 4
		},
		{
			label: 'À venir',
			color: 'gray',
			noBackround: true,
			description:
				"L'implémentation de l'authentification FranceConnect n'est pas encore évaluée.",
			position: 5
		}
	]
};
