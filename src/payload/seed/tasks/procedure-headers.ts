import { PayloadProcedureHeader } from "@/payload/payload-types";
import { BasePayload } from "payload"

type ProcedureHeaderWithoutSystemFields = Omit<PayloadProcedureHeader, 'id' | 'createdAt' | 'updatedAt'>;

const procedureHeadersTask = async (payload: BasePayload) => {
	const headers: ProcedureHeaderWithoutSystemFields[] = [
		{
			slug: 'satisfaction',
			label: 'Satisfaction Usagers',
			description: 'Evalue le niveau de satisfaction du service, par les usagers. Avis recueilli grâce au bouton "je donne mon avis".',
			icon: 'ri-emotion-happy-line',
			position: 2
		},
		{
			slug: 'online',
			label: 'Réalisable en ligne',
			description: 'Permet d\'évaluer si le service est entièrement disponible et réalisable en version numérique et en ligne.',
			icon: 'ri-computer-line',
			position: 1
		},
		{
			slug: 'usage',
			label: 'Utilisation de la version en ligne',
			description: 'Mesure le taux d\'utilisation du service numérique, par rapport à l\'utilisation tout canaux confondus',
			icon: 'ri-direction-line',
			position: 5
		},
		{
			slug: 'uptime',
			label: 'Disponibilité du service',
			description: null,
			icon: 'ri-rest-time-line',
			position: 9
		},
		{
			slug: 'help_reachable',
			label: 'Aide joignable et efficace',
			description: null,
			icon: 'ri-customer-service-2-line',
			position: 7
		},
		{
			slug: 'auth',
			label: 'Authentification',
			description: null,
			icon: 'ri-shield-user-line',
			position: 11
		},
		{
			slug: 'performance',
			label: 'Temps de chargement des pages',
			description: null,
			icon: 'ri-timer-flash-line',
			position: 10
		},
		{
			slug: 'dlnuf',
			label: 'Dites-le nous une fois',
			description: 'Simplifie les démarches des usagers, en leur évitant de fournir des informations ou des documents que l\'Administration détient déjà.',
			icon: 'ri-spam-line',
			position: 4
		},
		{
			slug: 'handicap',
			label: 'Prise en compte du handicap',
			description: 'Mesure le niveau d\'accessibilité numérique d\'une démarche, en se basant sur le RGAA (Référentiel Général d\'Amélioration de l\'Accessibilité).',
			icon: 'ri-open-arm-line',
			position: 3
		},
		{
			slug: 'simplicity',
			label: 'Simplicité du langage',
			description: null,
			icon: 'ri-sun-line',
			position: 6
		},
		{
			slug: 'help_used',
			label: 'Niveau d\'autonomie',
			description: null,
			icon: 'ri-chat-smile-line',
			position: 8
		}
	];

	await payload.delete({
		collection: 'payload-procedure-headers',
		where: {
			id: {
				exists: true
			}
		}
	});

	for (const header of headers) {
		await payload.create({
			collection: 'payload-procedure-headers',
			data: header
		});
	}

	payload.logger.info('Procedure headers seeded successfully');
}

export default procedureHeadersTask;