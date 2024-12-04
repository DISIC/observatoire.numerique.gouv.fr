import { PayloadProcedureHeader } from '@/payload/payload-types';
import { BasePayload } from 'payload';
import {
	authIndicatorWysiwygContent,
	dlnufWysiwygContent,
	handicapIndicatorWysiwygContent,
	helpReachableWysiwygContent,
	helpUsedIndicatorWysiwygContent,
	onlineIndicatorWysiwygContent,
	performanceIndicatorWysiwygContent,
	simplicityLanguageWysiwygContent,
	uptimeIndicatorWysiwygContent,
	usageOnlineIndicatorWysiwygContent,
	userSatifactionWysiwygContent
} from '../utils/wysiwyg-content';

type ProcedureHeaderWithoutSystemFields = Omit<
	PayloadProcedureHeader,
	'id' | 'createdAt' | 'updatedAt'
>;

const procedureHeadersTask = async (payload: BasePayload) => {
	const headers: ProcedureHeaderWithoutSystemFields[] = [
		{
			slug: 'satisfaction',
			label: 'Satisfaction Usagers',
			description_obj: userSatifactionWysiwygContent as any, // TODO: Fix this type when payload update
			moreInfosTitle: 'Méthode de calcul',
			moreInfos:
				'Pour calculer la note de satisfaction, nous réalisons une moyenne des réponses données à la question « Comment s’est passée cette démarche pour vous ? » en attribuant une note sur 10 à chaque option de réponses proposée dans le questionnaire.',
			icon: 'ri-emotion-happy-line',
			position: 2
		},
		{
			slug: 'online',
			label: 'Réalisable en ligne',
			description_obj: onlineIndicatorWysiwygContent as any, // TODO: Fix this type when payload update
			icon: 'ri-computer-line',
			position: 1
		},
		{
			slug: 'usage',
			label: 'Utilisation de la version en ligne',
			description_obj: usageOnlineIndicatorWysiwygContent as any, // TODO: Fix this type when payload update
			icon: 'ri-direction-line',
			position: 5
		},
		{
			slug: 'uptime',
			label: 'Disponibilité du service',
			description_obj: uptimeIndicatorWysiwygContent as any, // TODO: Fix this type when payload update
			moreInfosTitle: 'Méthode de calcul',
			moreInfos:
				"On obtient ce taux de disponibilité en divisant la durée durant laquelle ledit service est opérationnel par la durée totale durant laquelle on aurait souhaité qu'il le soit. Cet indicateur est calculé sur une durée de 3 mois précédant la publication de l’Observatoire.",
			icon: 'ri-rest-time-line',
			position: 9
		},
		{
			slug: 'help_reachable',
			label: 'Aide joignable et efficace',
			description_obj: helpReachableWysiwygContent as any, // TODO: Fix this type when payload update
			moreInfosTitle: 'Méthode de calcul',
			moreInfos:
				'Cette évaluation correspond à la somme des usagers ayant répondu, avoir eu l’intention de contacter le service mais qui n’aurait , soit pas réussi à trouver le moyen de le joindre ou pas pu faire aboutir cette prise de contact, cela sur le nombre total d’usagers ayant répondu au questionnaire.',
			icon: 'ri-customer-service-2-line',
			position: 7
		},
		{
			slug: 'auth',
			label: 'Authentification',
			description_obj: authIndicatorWysiwygContent as any, // TODO: Fix this type when payload update
			icon: 'ri-shield-user-line',
			position: 11
		},
		{
			slug: 'performance',
			label: 'Temps de chargement des pages',
			description_obj: performanceIndicatorWysiwygContent as any, // TODO: Fix this type when payload update
			moreInfosTitle: 'Méthode de calcul',
			moreInfos:
				'Afin de calculer cette vitesse d’affichage d’une page (ou “temps de réponse d’une page”), des tests sont réalisés par un outil automatique qui interroge 24 heures sur 24 les adresses URL des sites afin de calculer ce temps de réponse.',
			icon: 'ri-timer-flash-line',
			position: 10
		},
		{
			slug: 'dlnuf',
			label: 'Dites-le nous une fois',
			description_obj: dlnufWysiwygContent as any, // TODO: Fix this type when payload update
			moreInfosTitle: 'Méthode de calcul',
			moreInfos:
				"Afin d’évaluer l’efficacité de ce pré-remplissage, nous comptons le nombre d’informations au sein de la démarche demandées par l'administration à l'usager qui pourraient être pré-remplies.",
			icon: 'ri-spam-line',
			position: 4
		},
		{
			slug: 'handicap',
			label: 'Prise en compte du handicap',
			description_obj: handicapIndicatorWysiwygContent as any, // TODO: Fix this type when payload update
			moreInfosTitle: 'Méthode de calcul',
			moreInfos:
				"Le taux de conformité au RGAA est déterminé à la suite d'un audit réalisé par un.e expert.e accessibilité.",
			icon: 'ri-open-arm-line',
			position: 3
		},
		{
			slug: 'simplicity',
			label: 'Simplicité du langage',
			description_obj: simplicityLanguageWysiwygContent as any, // TODO: Fix this type when payload update
			moreInfosTitle: 'Méthode de calcul',
			moreInfos:
				'Pour calculer la note de simplicité du langage, nous réalisons une moyenne des réponses données à la question « Que pensez-vous du langage utilisé ? » en attribuant une note /10 aux trois réponses proposées dans le questionnaire.',
			icon: 'ri-sun-line',
			position: 6
		},
		{
			slug: 'help_used',
			label: "Niveau d'autonomie",
			description_obj: helpUsedIndicatorWysiwygContent as any, // TODO: Fix this type when payload update
			moreInfosTitle: 'Méthode de calcul',
			moreInfos:
				'Comme la note de satisfaction usager, cette note est calculée sur la base des retours usagers récoltés via le questionnaire de satisfaction (bouton «je donne mon avis», qui se trouve à la fin de la démarche).',
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
};

export default procedureHeadersTask;
