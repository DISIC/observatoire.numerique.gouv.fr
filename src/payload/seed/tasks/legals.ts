import { BasePayload } from 'payload';
import {
	legalsA11yWysiwygContent,
	legalsMentionsWysiwygContent,
	legalsPcWysiwygContent,
	legalsTermsWysiwygContent
} from '../utils/wysiwyg-content';

const legalsTask = async (payload: BasePayload) => {
	await payload.updateGlobal({
		slug: 'legals',
		data: {
			"legal-a11y": {
				title: "Accessibilité",
				wysiwyg: legalsA11yWysiwygContent as any,
			},
			"legal-mentions": {
				title: 'Mentions légales de Vos Démarches Essentielles',
				wysiwyg: legalsMentionsWysiwygContent as any,
			},
			"legal-pc": {
				title: 'Politique de confidentialité de Vos Démarches Essentielles',
				wysiwyg: legalsPcWysiwygContent as any,
			},
			"legal-terms": {
				title: "Modalités d'utilisation de Vos Démarches Essentielles",
				wysiwyg: legalsTermsWysiwygContent as any,
			},
			"legal-contact": {
				title: "Nous contacter",
				description: "Vous pouvez nous contacter à l'adresse e-mail suivante : observatoire@design.numerique.gouv.fr"
			},
		}
	});

	payload.logger.info('Legal content seeded successfully');
};

export default legalsTask;
