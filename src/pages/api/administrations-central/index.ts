import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import getPayloadClient from '@/payload/payload-client';

const prisma = new PrismaClient();

const validSlugs = [
	'satisfaction',
	'handicap',
	'dlnuf',
	'auth',
	'simplicity'
] as const;

export type RecordData = {
	text: string;
	count: number;
	data: { score: number; name: string; icon: string }[];
};

export async function getAdministrationsCentral() {
	const payload = await getPayloadClient({ seed: false });

	const administrationsCentral = await prisma.procedure.groupBy({
		by: ['administration_central'],
		where: {
			administration_central: {
				not: null
			}
		},
		_count: true,
		orderBy: {
			administration_central: 'asc'
		}
	});

	const validIndicators = (
		await payload.find({
			collection: 'payload-indicators',
			where: {
				slug: {
					in: validSlugs
				}
			}
		})
	).docs;

	const records = await Promise.all(
		administrationsCentral.map(async administrationCentral => {
			const current_administration_central =
				administrationCentral.administration_central as string;

			const procedures = await prisma.procedure.findMany({
				where: {
					administration_central: current_administration_central
				},
				select: {
					id: true
				}
			});

			const fields = await prisma.field.groupBy({
				by: ['slug', 'goalReached'],
				where: {
					slug: {
						in: [...validSlugs]
					},
					procedureId: {
						in: procedures.map(procedure => procedure.id)
					}
				},
				orderBy: {
					slug: 'asc'
				},
				_count: true
			});

			const indicators = validIndicators.map(indicator => {
				return {
					score: 0,
					slug: indicator.slug,
					name: indicator.label,
					icon: indicator.icon
				};
			});

			for (const field of validSlugs) {
				const fieldData = fields.filter(fieldData => fieldData.slug === field);
				if (fieldData.length !== 2) {
					console.error(
						`Field ${field} has not 2 records, but ${fieldData.length}`
					);
					continue;
				}
				const [countReached, countNotReached] = fieldData
					.sort((a, b) => (a.goalReached ? 1 : 0) - (b.goalReached ? 1 : 0))
					.map(fieldData => fieldData._count);

				const score = Math.round(
					(countReached / (countReached + countNotReached)) * 100
				);

				indicators[
					indicators.findIndex(indicator => indicator.slug === field)
				].score = score;
			}

			return {
				text: current_administration_central,
				count: administrationCentral._count,
				data: indicators
			};
		})
	);

	return records;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		const administrationsCentral = await getAdministrationsCentral();
		res.status(200).json(administrationsCentral);
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
