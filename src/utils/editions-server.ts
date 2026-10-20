import { prisma } from '@/utils/prisma';
import { cachedData } from '@/utils/data-cache';

export async function getLastEdition() {
	return cachedData('last-edition', () =>
		prisma.edition.findFirst({
			orderBy: { created_at: 'desc' }
		})
	);
}
