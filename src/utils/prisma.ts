import { PrismaClient } from '@prisma/client';

// Un seul client par instance : chaque PrismaClient ouvre son pool et les connexions PostgreSQL sont limitées
const withConnectionLimit = (url: string | undefined) => {
	if (!url) return url;
	const parsed = new URL(url);
	if (!parsed.searchParams.has('connection_limit')) {
		parsed.searchParams.set(
			'connection_limit',
			process.env.PRISMA_CONNECTION_LIMIT ?? '5'
		);
	}
	return parsed.toString();
};

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		datasources: {
			db: { url: withConnectionLimit(process.env.POSTGRESQL_ADDON_URI) }
		}
	});

globalForPrisma.prisma = prisma;

export default prisma;
