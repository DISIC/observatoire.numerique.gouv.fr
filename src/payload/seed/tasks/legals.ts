import { BasePayload } from 'payload';
import {
	legalsMentionsWysiwygContent,
	legalsPcWysiwygContent,
	legalsTermsWysiwygContent
} from '../utils/wysiwyg-content';

const legalsTask = async (payload: BasePayload) => {
	await payload.updateGlobal({
		slug: 'legals',
		data: {
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
		}
	});

	payload.logger.info('Legal content seeded successfully');
};

export default legalsTask;
