import {
	IndicatorColor,
	IndicatorSlug,
	PrismaClient,
	Procedure,
	Indicator,
	User
} from '@prisma/client';
import { procedures } from './seeds/procedures';
import { indicators } from './seeds/indicators';
import { users } from './seeds/users';

const prisma = new PrismaClient();

async function main() {
	const promises: Promise<Indicator | Procedure | User>[] = [];

	indicators.forEach(procedure_header => {
		promises.push(
			prisma.indicator.upsert({
				where: {
					slug: procedure_header.slug as IndicatorSlug
				},
				update: {},
				create: {
					...procedure_header,
					slug: procedure_header.slug as IndicatorSlug
				}
			})
		);
	});

	// procedures.forEach(procedure => {
	// 	const { fields, ...rest } = procedure;
	// 	promises.push(
	// 		prisma.procedure.upsert({
	// 			where: {
	// 				airtable_identifier: procedure.airtable_identifier
	// 			},
	// 			update: {},
	// 			create: {
	// 				...rest,
	// 				fields: {
	// 					create: fields.map(field => ({
	// 						...field,
	// 						slug: field.slug as IndicatorSlug,
	// 						color: field.color as IndicatorColor
	// 					}))
	// 				}
	// 			}
	// 		})
	// 	);
	// });

	users.forEach(user => {
		promises.push(
			prisma.user.upsert({
				where: {
					email: user.email
				},
				update: {},
				create: {
					...user
				}
			})
		);
	});

	Promise.all(promises).then(responses => {
		let log: { [key: string]: Indicator | Procedure | User } = {};
		responses.forEach(r => {
			if ('slug' in r) log[`header ${r.slug}`] = r;
			else if ('title' in r) log[`demarche ${r.title}`] = r;
			else if ('email' in r) log[`user ${r.email}`] = r;
		});
		console.log(log);
	});
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async e => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
