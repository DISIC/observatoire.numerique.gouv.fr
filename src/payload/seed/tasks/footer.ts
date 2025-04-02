import { BasePayload } from 'payload';

const footerTask = async (payload: BasePayload) => {
	await payload.updateGlobal({
		slug: 'footer',
		data: {
			"description": "Vos démarches essentielles est un service proposé par l'équipe design des services numériques (DesignGouv) de la direction interministérielle du numérique (DINUM)."
		}
	});

	payload.logger.info('Footer content seeded successfully');
};

export default footerTask;
