import { BasePayload } from "payload"
import uploadMedia from "../utils/upload-media"

const homeTask = async (payload: BasePayload) => {
	const qualityMediaBloc1 = await uploadMedia(payload, '../../../../public/assets/data-visualization.svg', 'icone représentative d\'une publication')
	const qualityMediaBloc2 = await uploadMedia(payload, '../../../../public/assets/city-hall.svg', 'icone représentative du recensement')

	await payload.updateGlobal({
		slug: 'home',
		data: {
			header: {
				title: 'Suivez l’amélioration de vos démarches essentielles',
				description: 'Cet outil permet d’évaluer en continu la qualité des démarches et services numériques, afin d’identifier des opportunités d’amélioration à prioriser.',
				buttonText: 'Consulter le tableau de suivi',
				buttonLink: '/observatoire'
			},
			quality: {
				title: 'Comment évaluons-nous la qualité de ces services ?',
				description: 'Nous répertorions les démarches et services numériques les plus fréquemment utilisés, et nous évaluons leur qualité à travers 5 indicateurs clés.',
				blocs: [
					{
						title: 'Une publication trimestrielle de la qualité des services',
						description: 'Tous les trois mois, nous mettons à jour l’évaluation de chaque service sur des critères de qualité et de performance.',
						buttonText: 'Comprendre l\'évaluation',
						buttonLink: '/Aide/Observatoire?tab=goals',
						image: qualityMediaBloc1.id,
					},
					{
						title: 'Le recensement des services numériques essentiels',
						description: 'L\'outil recense les services les plus utilisés, ou donnant accès à une aide financière publique nationale.',
						buttonText: 'Critères de selection',
						buttonLink: '/Aide/Observatoire?tab=criterias',
						image: qualityMediaBloc2.id,
					}
				]
			}
		}
	})

	payload.logger.info('Home content seeded successfully');
}

export default homeTask;