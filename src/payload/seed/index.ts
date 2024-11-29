import 'ignore-styles';
import 'dotenv/config';
import { getPayloadClient } from "../payload-client";

const argv = process.argv.slice(2);
const isDev = argv.includes('--dev');

export const seedData = async () => {
	try {
		const payload = await getPayloadClient({
			seed: true,
		});

		if (isDev) {
			payload.logger.info('Dev mode: Creating admin user...');
			await payload.create({
				collection: "payload-users",
				data: {
					email: "admin@test.loc",
					password: "admin123",
				},
			});
		}



	} catch (e) {
		console.error(e);
	} finally {
		process.exit();
	}
};

seedData();