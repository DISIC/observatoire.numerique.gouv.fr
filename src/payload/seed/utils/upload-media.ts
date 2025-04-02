import path from 'path';
import { fileURLToPath } from 'url';
import { BasePayload } from 'payload';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadMedia = async (
	payload: BasePayload,
	localPath: string,
	alt: string
) => {
	const newMedia = await payload.create({
		collection: 'payload-media',
		depth: 0,
		filePath: path.join(__dirname, localPath),
		data: {
			alt
		}
	});

	return newMedia;
};

export default uploadMedia;
