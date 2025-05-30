// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { Admins } from './collections/Admins';
import { Media } from './collections/Media';
import { CMSHome } from './globals/cms/Home';
import { s3Storage } from '@payloadcms/storage-s3';
import { Indicators } from './collections/Indicators';
import { CMSHelp } from './globals/cms/Help';
import { CMSLegals } from './globals/cms/Legals';
import { CMSFooter } from './globals/cms/Footer';
import IndicatorLevels from './collections/IndicatorLevels';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
	admin: {
		user: Admins.slug,
		importMap: {
			baseDir: path.resolve(dirname)
		}
	},
	collections: [Admins, Media, Indicators, IndicatorLevels],
	globals: [CMSHome, CMSHelp, CMSLegals, CMSFooter],
	editor: lexicalEditor(),
	secret: process.env.PAYLOAD_SECRET || '',
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts')
	},
	db: mongooseAdapter({
		url: process.env.DATABASE_URI || ''
	}),
	sharp,
	plugins: [
		s3Storage({
			collections: {
				'payload-media': true
			},
			acl: 'public-read',
			bucket: process.env.S3_BUCKET_NAME ?? '',
			config: {
				region: process.env.S3_REGION ?? 'eu',
				endpoint: `https://${process.env.CELLAR_ADDON_HOST}`,
				credentials: {
					accessKeyId: process.env.CELLAR_ADDON_KEY_ID ?? '',
					secretAccessKey: process.env.CELLAR_ADDON_KEY_SECRET ?? ''
				}
			}
		})
	]
});
