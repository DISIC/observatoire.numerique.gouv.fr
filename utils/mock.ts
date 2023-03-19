import { TProcedure, TProcedureHeader } from '@/pages/api/procedures/types';

export const proceduresTableHeaders: TProcedureHeader[] = [
	{
		slug: 'online',
		label: 'Réalisable en ligne',
		icon: 'ri-computer-line'
	},
	{
		slug: 'satisfaction',
		label: 'Satisfaction Usagers',
		icon: 'ri-emotion-happy-line'
	},
	{
		slug: 'handicap',
		label: 'Prise en compte du handicaps',
		icon: 'ri-open-arm-line'
	},
	{
		slug: 'dlnuf',
		label: 'Dites-le-nous une fois',
		icon: 'ri-spam-line'
	},
	{
		slug: 'usage',
		label: 'Utilisation de la version numérique',
		icon: 'ri-direction-line'
	},
	{
		slug: 'simplicity',
		label: 'Simplicité du langage',
		icon: 'ri-sun-line'
	},
	{
		slug: 'help-reachable',
		label: 'Aide joignable et efficace',
		icon: 'ri-customer-service-2-line'
	},
	{
		slug: 'help-used',
		label: 'Aide extérieure sollicitée',
		icon: 'ri-chat-smile-line'
	},
	{
		slug: 'uptime',
		label: 'Disponibilité du service',
		icon: 'ri-share-circle-fill'
	},
	{
		slug: 'performance',
		label: 'Temps de chargement des pages',
		icon: 'ri-timer-flash-line'
	}
	// {
	// 	slug: 'auth',
	// 	label: 'Authentification',
	// 	icon: 'ri-shield-user-line'
	// }
];

export const proceduresMock: TProcedure[] = [
	{
		title: 'Autorisation de plantation de vignes (Vitiplantation)',
		ministere: "Ministère de l'Agriculture et Alimentation",
		administration: 'FranceAgriMer - FAM',
		fields: [
			{
				slug: 'online',
				label: 'Oui',
				color: 'green',
				value: 'https://portailweb.franceagrimer.fr/portail/'
			},
			{ slug: 'satisfaction', label: 'Moyen', color: 'orange', value: 6.7 },
			{
				slug: 'handicap',
				label: 'Partielle',
				color: 'red',
				value: 'Conformité à 90%'
			},
			{ slug: 'dlnuf', label: 'Très Bon', color: 'green' },
			{ slug: 'usage', label: 'Faible', color: 'gray' },
			{ slug: 'simplicity', label: 'Faible', color: 'red' },
			{
				slug: 'help-reachable',
				label: 'Bientôt Disponible',
				color: 'gray',
				noBackground: true
			},
			{
				slug: 'help-used',
				label: 'Bientôt Disponible',
				color: 'gray',
				noBackground: true
			},
			{
				slug: 'uptime',
				label: 'Très Bon',
				color: 'green'
			},
			{
				slug: 'performance',
				label: 'Lent',
				color: 'red'
			},
			{
				slug: 'auth',
				label: 'FranceConnect',
				color: 'blue'
			}
		]
	},
	{
		title: 'Démarche n°2',
		ministere: "Ministère de l'Agriculture et Alimentation",
		administration: 'FranceAgriMer - FAM',
		fields: [
			{
				slug: 'online',
				label: 'Oui',
				color: 'green',
				value: 'https://portailweb.franceagrimer.fr/portail/'
			},
			{ slug: 'satisfaction', label: 'Moyen', color: 'orange', value: 6.7 },
			{ slug: 'handicap', label: 'Non', color: 'red' },
			{ slug: 'dlnuf', label: 'Très Bon', color: 'green' },
			{ slug: 'usage', label: 'Faible', color: 'gray' },
			{ slug: 'simplicity', label: 'Faible', color: 'red' },
			{
				slug: 'help-reachable',
				label: 'Bientôt Disponible',
				color: 'gray',
				noBackground: true
			},
			{
				slug: 'help-used',
				label: 'Bientôt Disponible',
				color: 'gray',
				noBackground: true
			},
			{
				slug: 'uptime',
				label: 'Très Bon',
				color: 'green'
			},
			{
				slug: 'performance',
				label: 'Lent',
				color: 'red'
			},
			{
				slug: 'auth',
				label: 'FranceConnect',
				color: 'blue'
			}
		]
	},
	{
		title: 'Démarche n°3',
		ministere: "Ministère de l'Agriculture et Alimentation",
		administration: 'FranceAgriMer - FAM',
		fields: [
			{
				slug: 'online',
				label: 'Oui',
				color: 'green',
				value: 'https://portailweb.franceagrimer.fr/portail/'
			},
			{ slug: 'satisfaction', label: 'Moyen', color: 'orange', value: 6.7 },
			{ slug: 'handicap', label: 'Non', color: 'red' },
			{ slug: 'dlnuf', label: 'Très Bon', color: 'green' },
			{ slug: 'usage', label: 'Faible', color: 'gray' },
			{ slug: 'simplicity', label: 'Faible', color: 'red' },
			{
				slug: 'help-reachable',
				label: 'Bientôt Disponible',
				color: 'gray',
				noBackground: true
			},
			{
				slug: 'help-used',
				label: 'Bientôt Disponible',
				color: 'gray',
				noBackground: true
			},
			{
				slug: 'uptime',
				label: 'Très Bon',
				color: 'green'
			},
			{
				slug: 'performance',
				label: 'Lent',
				color: 'red'
			},
			{
				slug: 'auth',
				label: 'FranceConnect',
				color: 'blue'
			}
		]
	}
];
