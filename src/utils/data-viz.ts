import { PrismaClient } from '@prisma/client';
import getPayloadClient from '@/payload/payload-client';
import { ProcedureKind } from '@/pages/api/indicator-scores';

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
	data: {
		score: number;
		goal: number;
		cross: number;
		slug: string;
		name: string;
		icon: string;
	}[];
};

type GetIndicatorScoresByProcedureKindProps = {
	kind: ProcedureKind;
	groupByKind: { text: string; _count: number }[];
};

export async function getIndicatorScoresByProcedureKind({
	kind,
	groupByKind
}: GetIndicatorScoresByProcedureKindProps) {
	const payload = await getPayloadClient({ seed: false });

	const currentEdition = await prisma.edition.findFirstOrThrow({
		orderBy: {
			created_at: 'desc'
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
		groupByKind.map(async group => {
			const procedures = await prisma.procedure.findMany({
				where: {
					[kind]: group.text,
					editionId: currentEdition.id
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

			const indicators = validIndicators.map(indicator => ({
				score: 0,
				goal: 80,
				cross: 0,
				slug: indicator.slug,
				name: indicator.label,
				icon: indicator.icon
			})) as RecordData['data'];

			for (const field of validSlugs) {
				const fieldData = fields.filter(fieldData => fieldData.slug === field);

				let countReached = 0;
				let countNotReached = 0;

				if (fieldData.length > 0) {
					const reachedData = fieldData.find(f => f.goalReached === true);
					const notReachedData = fieldData.find(f => f.goalReached === false);

					countReached = reachedData ? reachedData._count : 0;
					countNotReached = notReachedData ? notReachedData._count : 0;
				}

				const totalCount = countReached + countNotReached;
				const score =
					totalCount > 0 ? Math.round((countReached / totalCount) * 100) : 0;

				indicators[
					indicators.findIndex(indicator => indicator.slug === field)
				].score = score;
			}

			return {
				text: group.text,
				count: group._count,
				data: indicators
			};
		})
	);

	return records;
}
