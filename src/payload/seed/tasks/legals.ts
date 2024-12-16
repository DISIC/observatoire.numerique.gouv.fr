import { BasePayload } from 'payload';
import {
	legalsMentionsWysiwygContent
} from '../utils/wysiwyg-content';

const legalsTask = async (payload: BasePayload) => {
	await payload.updateGlobal({
		slug: 'legals',
		data: {
			"legal-mentions": {
				title: 'Mentions légales de Vos Démarches Essentielles',
				wysiwyg: legalsMentionsWysiwygContent as any,
			},
		}
	});

	payload.logger.info('Legal content seeded successfully');
};

export default legalsTask;
