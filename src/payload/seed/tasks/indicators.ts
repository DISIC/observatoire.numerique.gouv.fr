import { PayloadIndicator } from '@/payload/payload-types';
import { BasePayload } from 'payload';
import {
	authIndicatorWysiwygContent,
	dlnufWysiwygContent,
	handicapIndicatorWysiwygContent,
	helpEfficientWysiwygContent,
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
	const indicators: IndicatorWithoutSystemFields[] = [
		{
			slug: 'satisfaction',
			label: 'Satisfaction Usagers',
			description:
				'Evalue le niveau de satisfaction du service, par les usagers. Avis recueilli grâce au bouton “je donne mons avis“.',
			description_obj: userSatifactionWysiwygContent as any, // TODO: Fix this type when payload update
			moreInfosTitle: 'Méthode de calcul',
			moreInfos:
				'Pour calculer la note de satisfaction, nous réalisons une moyenne des réponses données à la question « Comment s’est passée cette démarche pour vous ? » en attribuant une note sur 10 à chaque option de réponses proposée dans le questionnaire.',
			icon: 'ri-emoji-sticker-line',
			position: 2,
			threshold_max: 10
		},
		{
			slug: 'online',
			label: 'Réalisable en ligne',
			description:
				'Permet d’évaluer si le service est entièrement disponible et réalisable en version numérique et en ligne.',
			description_obj: onlineIndicatorWysiwygContent as any, // TODO: Fix this type when payload update
			icon: 'ri-mac-line',
			position: 1
		},
		{
			slug: 'usage',
			label: "Taux d'utilisation de la version numérique",
			description:
				'Mesure le taux d’utilisation du service numérique, par rapport à l’utilisation tout canaux confondus.',
			description_obj: usageOnlineIndicatorWysiwygContent as any, // TODO: Fix this type when payload update
			icon: 'ri-device-line',
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
			icon: 'ri-signal-tower-line',
			position: 10
		},
		{
			slug: 'help_reachable',
			label: 'Aide joignable',
			description: null,
			description_obj: helpReachableWysiwygContent as any, // TODO: Fix this type when payload update
			moreInfosTitle: 'Méthode de calcul',
			moreInfos:
				"Il s’agit du ratio entre le nombre d’usagers ayant réussi à joindre le contact d’aide et le nombre de répondants à la question « Quand vous avez cherché de l'aide, avez-vous réussi à joindre l'administration ? ». La note publiée s’établit sur 12 mois glissants. Elle s'affiche si au moins 100 avis ont été déposés sur cette période.",
			icon: 'ri-customer-service-line',
			position: 7
		},
		{
			slug: 'help_efficient',
			label: 'Aide efficace',
			description: null,
			description_obj: helpEfficientWysiwygContent as any, // TODO: Fix this type when payload update
			moreInfosTitle: 'Méthode de calcul',
			moreInfos: `
				Une échelle à 5 valeurs est proposée en réponse à la question « Comment évaluez-vous la qualité de l'aide que vous avez obtenue de la part de l'administration ? ». Le résultat est ramené à une note moyenne sur 10. 
				Les valeurs sont pondérées de la façon suivante :
				-	Très mauvaise = 0/10 ; 
				-	Mauvaise = 2,5/10 ; 
				-	Ni bonne, ni mauvaise = 5 /10 ; 
				-	Bonne = 7,5/10 ; 
				-	Excellente = 10/10. 
				La note publiée s’établit sur 12 mois glissants. Elle s'affiche si au moins 100 avis ont été déposés sur cette période
				`,
			icon: 'ri-customer-service-line',
			position: 8
		},
		{
			slug: 'auth',
			label: 'Authentification',
			description: null,
			description_obj: authIndicatorWysiwygContent as any, // TODO: Fix this type when payload update
			icon: 'ri-lock-unlock-line',
			position: 12
		},
		{
			slug: 'performance',
			label: 'Temps de chargement des pages',
			description: null,
			description_obj: performanceIndicatorWysiwygContent as any, // TODO: Fix this type when payload update
			moreInfosTitle: 'Méthode de calcul',
			moreInfos:
				'Afin de calculer cette vitesse d’affichage d’une page (ou “temps de réponse d’une page”), des tests sont réalisés par un outil automatique qui interroge 24 heures sur 24 les adresses URL des sites afin de calculer ce temps de réponse.',
			icon: 'ri-timer-line',
			position: 11
		},
		{
			slug: 'dlnuf',
			label: 'Dites-le-nous une fois',
			description:
				"Simplifie les démarches des usagers, en leur évitant de fournir des informations ou des documents que l'Administration détient déjà.",
			description_obj: dlnufWysiwygContent as any, // TODO: Fix this type when payload update
			moreInfosTitle: 'Méthode de calcul',
			moreInfos:
				"Afin d’évaluer l’efficacité de ce pré-remplissage, nous comptons le nombre d’informations au sein de la démarche demandées par l'administration à l'usager qui pourraient être pré-remplies.",
			icon: 'ri-pass-valid-line',
			position: 4,
			threshold_max: 5
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
			position: 3,
			threshold_max: 100
		},
		{
			slug: 'simplicity',
			label: 'Clarté du langage',
			description: null,
			description_obj: simplicityLanguageWysiwygContent as any, // TODO: Fix this type when payload update
			moreInfosTitle: 'Méthode de calcul',
			moreInfos:
				'Pour calculer la note de clarté du langage, nous réalisons une moyenne des réponses données à la question « Que pensez-vous du langage utilisé ? » en attribuant une note /10 aux trois réponses proposées dans le questionnaire.',
			icon: 'ri-speak-line',
			position: 6,
			threshold_max: 10
		},
		{
			slug: 'help_used',
			label: "Niveau d'autonomie",
			description: null,
			description_obj: helpUsedIndicatorWysiwygContent as any, // TODO: Fix this type when payload update
			moreInfosTitle: 'Méthode de calcul',
			moreInfos:
				'Comme la note de satisfaction usager, cette note est calculée sur la base des retours usagers récoltés via le questionnaire de satisfaction (bouton «je donne mon avis», qui se trouve à la fin de la démarche).',
			icon: 'ri-user-line',
			position: 9
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

	for (const indicator of indicators) {
		await payload
			.create({
				collection: 'payload-indicators',
				data: indicator
			})
			.then(createdIndicator => {
				const levels =
					Object.entries(indicatorLevels).find(
						([slug]) => slug === indicator.slug
					)?.[1] || [];
				return Promise.all(
					levels.map(level =>
						payload.create({
							collection: 'payload-indicator-levels',
							data: {
								...level,
								indicator: createdIndicator.id
							}
						})
					)
				);
			});
	}

	payload.logger.info('Indicators seeded successfully');
};

export default indicatorsTask;
