import 'dotenv/config';
import 'ignore-styles';
import { getPayloadClient } from '../payload-client';
import homeTask from './tasks/home';
import procedureHeadersTask from './tasks/procedure-headers';
import helpTask from './tasks/help';

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

		await procedureHeadersTask(payload);
		await homeTask(payload);
		await helpTask(payload);
	} catch (e) {
		console.error(e);
	} finally {
		process.exit();
	}
};

seedData();
