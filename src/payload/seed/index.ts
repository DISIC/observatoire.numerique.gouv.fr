import 'dotenv/config';
import 'ignore-styles';
import { getPayloadClient } from '../payload-client';
import homeTask from './tasks/home';
import indicatorsTask from './tasks/indicators';
import helpTask from './tasks/help';
import legalsTask from './tasks/legals';
import footerTask from './tasks/footer';

const argv = process.argv.slice(2);
const isDev = argv.includes('--dev');

export const seedData = async () => {
	try {
		const payload = await getPayloadClient({
			seed: true
		});

		if (isDev) {
			payload.logger.info('Dev mode: Creating admin user...');
			await payload.create({
				collection: 'payload-admins',
				data: {
					email: 'admin@test.loc',
					password: 'admin123'
				}
			});
		}

		await indicatorsTask(payload);
		await homeTask(payload);
		await helpTask(payload);
		await footerTask(payload);
		await legalsTask(payload);
	} catch (e) {
		console.error(e);
	} finally {
		process.exit();
	}
};

seedData();
