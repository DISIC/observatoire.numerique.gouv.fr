import getPayloadClient from '@/payload/payload-client';
import { getFieldsFromProcedure } from '@/trpc/routers/utils';
import { PrismaClient } from '@prisma/client';

async function updateGoalReachedProperty() {
	const prisma = new PrismaClient();

	const payload = await getPayloadClient({
		seed: false
	});

	try {
		console.log('Starting update process...');

		let indicators = await payload.find({
			collection: 'payload-indicators',
			select: {
				id: true,
				slug: true,
				levels: true
			},
			limit: 100
		});

		indicators.docs = indicators.docs.filter(indicator => {
			return (
				indicator.levels?.docs?.some(
					level =>
						typeof level != 'string' &&
						(level.goal_reached !== undefined || level.goal_reached !== null)
				) || false
			);
		});

		console.log(
			`Found ${indicators.docs.length} indicators with goal_reached property.`
		);

		const procedures = await prisma.procedure.findMany({
			include: {
				fields: true
			},
			where: {
				fields: {
					some: {
						slug: {
							in: indicators.docs.map(indicator => indicator.slug)
						},
						goalReached: {
							isSet: false
						}
					}
				}
			}
		});

		console.log(`Found ${procedures.length} procedures to update.`);

		let updatedCount = 0;

		for (const procedure of procedures) {
			const updatedFields = getFieldsFromProcedure(procedure, indicators.docs);

			if (updatedFields.length > 0) {
				await prisma.$transaction(async prisma => {
					for (const field of updatedFields) {
						await prisma.field.update({
							where: { id: field.id as string },
							data: { goalReached: field.goalReached }
						});
					}
				});
				updatedCount += updatedFields.length;
			}
		}

		console.log(`Updated goalReached for ${updatedCount} fields.`);
		console.log('Update process completed successfully.');
	} catch (error) {
		console.error('Error updating goalReached property:', error);
	} finally {
		await prisma.$disconnect();
		process.exit();
	}
}

updateGoalReachedProperty()
	.then(() => console.log('Script execution completed.'))
	.catch(error => console.error('Script execution failed:', error));
