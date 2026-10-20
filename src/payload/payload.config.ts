// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres';
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
import { Versions } from './collections/Versions';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

// Typé en options SMTP transport : depuis nodemailer 10, `auth` n'est plus dans SMTPConnection.Options
const transportOptions: SMTPTransport.Options = {
	host: process.env.NODEMAILER_HOST,
	port: process.env.NODEMAILER_PORT ?? 587,
	auth: {
		user: process.env.NODEMAILER_USER || process.env.MAILPACE_API_KEY,
		pass: process.env.NODEMAILER_PASSWORD || process.env.MAILPACE_API_KEY
	}
};

// Origine publique de l'env : serverURL et liste csrf
const getPublicOrigin = () => {
	const url = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXTAUTH_URL;
	if (!url) return '';
	try {
		return new URL(url).origin;
	} catch {
		return '';
	}
};
const publicOrigin = getPublicOrigin();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
	admin: {
		user: Admins.slug,
		importMap: {
			baseDir: path.resolve(dirname)
		}
	},
	collections: [Admins, Media, Indicators, IndicatorLevels, Versions],
	globals: [CMSHome, CMSHelp, CMSLegals, CMSFooter],
	editor: lexicalEditor(),
	secret: process.env.PAYLOAD_SECRET || '',
	serverURL: publicOrigin,
	csrf: publicOrigin ? [publicOrigin] : [],
	graphQL: {
		disable: true
	},
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts')
	},
	// Payload dans le schéma « payload », Prisma dans « public »
	db: postgresAdapter({
		pool: {
			connectionString:
				process.env.DATABASE_URI || process.env.POSTGRESQL_ADDON_URI || '',
			max: Number(process.env.PAYLOAD_DB_POOL_MAX ?? 5)
		},
		schemaName: 'payload',
		push: false,
		migrationDir: path.resolve(dirname, '../migrations')
	}),
	sharp,
	email: nodemailerAdapter({
		defaultFromAddress:
			process.env.NODEMAILER_FROM ?? 'noreply@observatoire.numerique.gouv.fr',
		defaultFromName: 'Vos démarches ensentielles',
		transportOptions
	}),
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
