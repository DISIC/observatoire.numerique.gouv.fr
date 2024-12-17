import { PayloadIndicator } from '@/payload/payload-types';
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
import { indicatorLevels } from '../utils/indicator-levels';

type IndicatorWithoutSystemFields = Omit<
	PayloadIndicator,
	'id' | 'createdAt' | 'updatedAt'
>;

const indicatorsTask = async (payload: BasePayload) => {
	const headers: IndicatorWithoutSystemFields[] = [
		{
			slug: 'satisfaction',
			label: 'Satisfaction Usagers',
			description:
				'Evalue le niveau de satisfaction du service, par les usagers. Avis recueilli grâce au bouton “je donne mons avis“.',
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
			description:
				'Permet d’évaluer si le service est entièrement disponible et réalisable en version numérique et en ligne.',
			description_obj: onlineIndicatorWysiwygContent as any, // TODO: Fix this type when payload update
			icon: 'ri-computer-line',
			position: 1
		},
		{
			slug: 'usage',
			label: 'Utilisation de la version en ligne',
			description:
				'Mesure le taux d’utilisation du service numérique, par rapport à l’utilisation tout canaux confondus.',
			description_obj: usageOnlineIndicatorWysiwygContent as any, // TODO: Fix this type when payload update
			icon: 'ri-direction-line',
			position: 5
		},
		{
			slug: 'uptime',
			label: 'Disponibilité du service',
			description: null,
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
			description: null,
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
			description: null,
			description_obj: authIndicatorWysiwygContent as any, // TODO: Fix this type when payload update
			icon: 'ri-shield-user-line',
			position: 11
		},
		{
			slug: 'performance',
			label: 'Temps de chargement des pages',
			description: null,
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
			description:
				"Simplifie les démarches des usagers, en leur évitant de fournir des informations ou des documents que l'Administration détient déjà.",
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
			description:
				"Mesure le niveau d’accessibilité numérique d’une démarche, en se basant sur le RGAA (Référentiel Général d'Amélioration de l'Accessibilité).",
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
			description: null,
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
			description: null,
			description_obj: helpUsedIndicatorWysiwygContent as any, // TODO: Fix this type when payload update
			moreInfosTitle: 'Méthode de calcul',
			moreInfos:
				'Comme la note de satisfaction usager, cette note est calculée sur la base des retours usagers récoltés via le questionnaire de satisfaction (bouton «je donne mon avis», qui se trouve à la fin de la démarche).',
			icon: 'ri-chat-smile-line',
			position: 8
		}
	];

	await payload.delete({
		collection: 'payload-indicators',
		where: {
			id: {
				exists: true
			}
		}
	});

	for (const header of headers) {
		await payload
			.create({
				collection: 'payload-indicators',
				data: header
			})
			.then(createdHeader => {
				// get the levels for this header slug or an empty array if not found
				const levels =
					Object.entries(indicatorLevels).find(
						([slug]) => slug === header.slug
					)?.[1] || [];
				// create the levels for this header
				return Promise.all(
					levels.map(level =>
						payload.create({
							collection: 'payload-indicator-levels',
							data: {
								...level,
								indicator: createdHeader.id
							}
						})
					)
				);
			});
	}

	payload.logger.info('Procedure headers seeded successfully');
};

export default indicatorsTask;
