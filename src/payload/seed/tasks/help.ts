import { BasePayload } from 'payload';
import {
	criteriasWysiwygContent,
	goalsWysiwygContent
} from '../utils/wysiwyg-content';

const helpTask = async (payload: BasePayload) => {
	const indicators = await payload.find({
		collection: 'payload-procedure-headers',
		limit: 20
	});

	await payload.updateGlobal({
		slug: 'help',
		data: {
			header: {
				title: 'Méthodologie et calcul des indicateurs'
			},
			goals: {
				title: 'Objectifs et méthodologie',
				wysiwyg: goalsWysiwygContent as any // TODO: Fix this type when payload update
			},
			criterias: {
				title: "Critères d'entrée des services",
				wysiwyg: criteriasWysiwygContent as any, // TODO: Fix this type when payload update
				buttonText: "Je propose l'ajout d'un service",
				buttonLink: '/demande'
			},
			indicators: {
				title: 'Indicateurs de qualité',
				keyIndicators: {
					keyIndicatorsTitle: 'Les indicateurs clés',
					keyIndicatorsList: [
						{ indicator: indicators.docs.find(i => i.slug === 'online')?.id },
						{
							indicator: indicators.docs.find(i => i.slug === 'satisfaction')
								?.id
						},
						{ indicator: indicators.docs.find(i => i.slug === 'handicap')?.id },
						{ indicator: indicators.docs.find(i => i.slug === 'dlnuf')?.id },
						{ indicator: indicators.docs.find(i => i.slug === 'usage')?.id }
					]
				},
				additionnalIndicators: {
					additionnalIndicatorsTitle: 'Les indicateurs complémentaires',
					additionnalIndicatorsDescription:
						'Des indicateurs complémentaires permettent aux équipes d’affiner l’identification d’opportunités d’améliorations.',
					additionnalIndicatorsList: [
						{
							indicator: indicators.docs.find(i => i.slug === 'simplicity')?.id
						},
						{
							indicator: indicators.docs.find(i => i.slug === 'help_reachable')
								?.id
						},
						{
							indicator: indicators.docs.find(i => i.slug === 'help_used')?.id
						},
						{ indicator: indicators.docs.find(i => i.slug === 'uptime')?.id },
						{
							indicator: indicators.docs.find(i => i.slug === 'performance')?.id
						},
						{ indicator: indicators.docs.find(i => i.slug === 'auth')?.id }
					]
				}
			}
		}
	});

	payload.logger.info('Help content seeded successfully');
};

export default helpTask;
