import { deleteEdition } from '@/pages/api/editions';
import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { fetchGristProcedures } from './grist';

const prisma = new PrismaClient();

const PROCEDURES_CREATE_CHUNK_SIZE = 20;

const objectId = z.string().regex(/^[a-f\d]{24}$/i);

export const editions = router({
	getSummary: protectedProcedure
		.input(z.object({ id: objectId }))
		.query(async ({ input }) => {
			const edition = await prisma.edition.findUnique({
				where: { id: input.id }
			});

			if (!edition) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: "Cette édition n'existe pas."
				});
			}

			const [procedures, currentEdition] = await Promise.all([
				prisma.procedure.findMany({
					where: { editionId: edition.id },
					select: { ministere: true, administration: true }
				}),
				prisma.edition.findFirst({
					orderBy: { created_at: 'desc' },
					select: { id: true }
				})
			]);

			return {
				edition,
				isCurrent: currentEdition?.id === edition.id,
				proceduresCount: procedures.length,
				ministeresCount: new Set(procedures.map(p => p.ministere)).size,
				administrationsCount: new Set(procedures.map(p => p.administration))
					.size
			};
		}),
	delete: protectedProcedure
		.input(z.object({ id: objectId }))
		.mutation(async ({ input }) => {
			await deleteEdition(input.id);
			return { success: true };
		}),
	republish: protectedProcedure
		.input(
			z.object({
				id: objectId,
				gristEditionId: z.number(),
				version: z.number()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const edition = await prisma.edition.findUnique({
				where: { id: input.id }
			});

			if (!edition) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: "Cette édition n'existe pas."
				});
			}

			// Récupère Grist avant toute suppression : en cas d'échec, l'édition reste intacte
			const procedures = await fetchGristProcedures(
				ctx.payload,
				input.gristEditionId
			);

			if (!procedures.length) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Aucune démarche trouvée dans Grist pour cette édition.'
				});
			}

			await deleteEdition(edition.id);

			// Même id et même created_at : les liens et l'ordre des éditions sont conservés
			await prisma.edition.create({
				data: {
					id: edition.id,
					name: edition.name,
					start_date: edition.start_date,
					end_date: edition.end_date,
					created_at: edition.created_at,
					version: input.version
				}
			});

			for (
				let i = 0;
				i < procedures.length;
				i += PROCEDURES_CREATE_CHUNK_SIZE
			) {
				await Promise.all(
					procedures
						.slice(i, i + PROCEDURES_CREATE_CHUNK_SIZE)
						.map(({ id, fields, ...procedure }) =>
							prisma.procedure.create({
								data: {
									...procedure,
									editionId: edition.id,
									fields: {
										create: fields.map(({ id, procedureId, ...field }) => field)
									}
								}
							})
						)
				);
			}

			return { proceduresCount: procedures.length };
		})
});
