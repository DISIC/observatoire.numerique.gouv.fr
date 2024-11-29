import { ProcedureHeader } from "@/payload/payload-types";
import { BasePayload } from "payload"

type ProcedureHeaderWithoutSystemFields = Omit<ProcedureHeader, 'id' | 'createdAt' | 'updatedAt'>;

const procedureHeadersTask = async (payload: BasePayload) => {
	const headers: ProcedureHeaderWithoutSystemFields[] = [
		{
			slug: 'satisfaction',
			label: 'Satisfaction Usagers',
			description: 'Evalue le niveau de satisfaction',
			icon: 'ri-emotion-happy-line',
			position: 2
		},
		{
			slug: 'online',
			label: 'Réalisable en ligne',
			description: 'Permet d\'évaluer si la démarche est réalisable en ligne',
			icon: 'ri-computer-line',
			position: 1
		},
		{
			slug: 'usage',
			label: 'Utilisation de la version en ligne',
			description: 'Mesure le taux d\'utilisation',
			icon: 'ri-direction-line',
			position: 5
		},
		{
			slug: 'uptime',
			label: 'Disponibilité du service',
			icon: 'ri-rest-time-line',
			position: 9
		},
		{
			slug: 'help_reachable',
			label: 'Aide joignable et efficace',
			icon: 'ri-customer-service-2-line',
			position: 7
		},
		{
			slug: 'auth',
			label: 'Authentification',
			icon: 'ri-shield-user-line',
			position: 11
		},
		{
			slug: 'performance',
			label: 'Temps de chargement des pages',
			icon: 'ri-timer-flash-line',
			position: 10
		},
		{
			slug: 'dlnuf',
			label: 'Dites-le nous une fois',
			description: 'Simplifie les démarches',
			icon: 'ri-spam-line',
			position: 4
		},
		{
			slug: 'handicap',
			label: 'Prise en compte du handicap',
			description: 'Mesure le niveau d\'accessibilité',
			icon: 'ri-open-arm-line',
			position: 3
		},
		{
			slug: 'simplicity',
			label: 'Simplicité du langage',
			icon: 'ri-sun-line',
			position: 6
		},
		{
			slug: 'help_used',
			label: 'Niveau d\'autonomie',
			icon: 'ri-chat-smile-line',
			position: 8
		}
	];

	for (const header of headers) {
		await payload.create({
			collection: 'procedure-headers',
			data: header
		});
	}

	payload.logger.info('Procedure headers seeded successfully');
}

export default procedureHeadersTask;