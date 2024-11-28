// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { CMSHome } from './globals/cms/Home'
import { s3Storage } from '@payloadcms/storage-s3'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
	admin: {
		user: Users.slug,
		importMap: {
			baseDir: path.resolve(dirname),
		},
	},
	collections: [Users, Media],
	globals: [CMSHome],
	editor: lexicalEditor(),
	secret: process.env.PAYLOAD_SECRET || '',
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts'),
	},
	db: mongooseAdapter({
		url: process.env.DATABASE_URI || '',
	}),
	sharp,
	plugins: [
		s3Storage({
			collections: {
				'payload-media': true
			},
			acl: "public-read",
			bucket: process.env.S3_BUCKET_NAME ?? "",
			config: {
				endpoint: process.env.CELLAR_ADDON_HOST,
				credentials: {
					accessKeyId: process.env.CELLAR_ADDON_KEY_ID ?? "",
					secretAccessKey: process.env.CELLAR_ADDON_KEY_SECRET ?? "",
				},
			},
		}),
	],
})
