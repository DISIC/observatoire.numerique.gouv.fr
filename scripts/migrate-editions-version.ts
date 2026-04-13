import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const result = await prisma.edition.updateMany({
		where: {
			version: { not: 2 }
		},
		data: {
			version: 2
		}
	});

	console.log(`Updated ${result.count} editions to version 2`);
}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
