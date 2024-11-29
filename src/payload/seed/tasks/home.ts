import { BasePayload } from 'payload';
import uploadMedia from '../utils/upload-media';

const homeTask = async (payload: BasePayload) => {
	const qualityMediaBloc1 = await uploadMedia(
		payload,
		'../../../../public/assets/data-visualization.svg',
		"icone représentative d'une publication"
	);
	const qualityMediaBloc2 = await uploadMedia(
		payload,
		'../../../../public/assets/city-hall.svg',
		'icone représentative du recensement'
	);

	const textWithImage1 = await uploadMedia(
		payload,
		'../../../../public/assets/top250.svg',
		'icone représentative du top 250'
	);
	const textWithImage2 = await uploadMedia(
		payload,
		'../../../../public/assets/agents.svg',
		"image représentative d'agents du service public"
	);
	const textWithImage3 = await uploadMedia(
		payload,
		'../../../../public/assets/jdma.svg',
		"image représentative de l'outil jdma"
	);

	await payload.updateGlobal({
		slug: 'home',
		data: {
			header: {
				title: 'Suivez l’amélioration de vos démarches essentielles',
				description:
					'Cet outil permet d’évaluer en continu la qualité des démarches et services numériques, afin d’identifier des opportunités d’amélioration à prioriser.',
				buttonText: 'Consulter le tableau de suivi',
				buttonLink: '/observatoire'
			},
			quality: {
				title: 'Comment évaluons-nous la qualité de ces services ?',
				description:
					'Nous répertorions les démarches et services numériques les plus fréquemment utilisés, et nous évaluons leur qualité à travers 5 indicateurs clés.',
				blocs: [
					{
						title: 'Une publication trimestrielle de la qualité des services',
						description:
							'Tous les trois mois, nous mettons à jour l’évaluation de chaque service sur des critères de qualité et de performance.',
						buttonText: "Comprendre l'évaluation",
						buttonLink: '/Aide/Observatoire?tab=goals',
						image: qualityMediaBloc1.id
					},
					{
						title: 'Le recensement des services numériques essentiels',
						description:
							"L'outil recense les services les plus utilisés, ou donnant accès à une aide financière publique nationale.",
						buttonText: 'Critères de selection',
						buttonLink: '/Aide/Observatoire?tab=criterias',
						image: qualityMediaBloc2.id
					}
				]
			},
			procedureHeaders: {
				title: 'Zoom sur les indicateurs.',
				description:
					'Nous avons défini 5 indicateurs clés afin de suivre les améliorations des services numériques. Ils couvrent les enjeux de qualité de l’expérience utilisateur, de la proactivité et de la performance.',
				buttonText: 'Consulter tous les indicateurs',
				buttonLink: '/Aide/Observatoire?tab=indicators'
			},
			redirections: {
				textsWithImages: [
					{
						title: 'Un service public numérique semble manquer à la liste ?',
						description:
							'Toute personne, qu’elle soit citoyenne ou agent administratif peut proposer l’ajout d’une démarche ou d’un service public numérique.',
						buttonText: 'Proposer une démarche ou un service',
						buttonLink: '/demande',
						image: textWithImage1
					},
					{
						title:
							'Vous êtes agent France Service, accompagnant social ou médiateur numérique ?',
						description:
							'Faites part des difficultés persistantes rencontrées lors de la réalisation des démarches en ligne.',
						buttonText: 'Partagez-nous votre experience',
						buttonLink:
							'https://www.plus.transformation.gouv.fr/experience/step_1',
						image: textWithImage2
					},
					{
						title:
							'Vous êtes une administration et vous souhaitez suivre la satisfaction de vos usagers ?',
						description:
							'Grâce à l’ajout du bouton “je donne mon avis” à la fin de vos démarches vous pourrez recueillir tous les avis de vos usagers en temps réel.',
						buttonText: 'Ajouter le bouton “je donne mon avis”',
						buttonLink: 'https://jedonnemonavis.numerique.gouv.fr/',
						image: textWithImage3
					}
				]
			}
		}
	});

	payload.logger.info('Home content seeded successfully');
};

export default homeTask;
