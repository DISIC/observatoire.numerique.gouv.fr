import { TProcedure } from '@/pages/api/procedures/types';

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
				link: 'https://portailweb.franceagrimer.fr/portail/'
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
		title: 'Démarche n°2',
		ministere: "Ministère de l'Agriculture et Alimentation",
		administration: 'FranceAgriMer - FAM',
		fields: [
			{
				slug: 'online',
				label: 'Oui',
				color: 'green',
				link: 'https://portailweb.franceagrimer.fr/portail/'
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
				link: 'https://portailweb.franceagrimer.fr/portail/'
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
