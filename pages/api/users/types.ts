import { Prisma } from '@prisma/client';

const procedureWithFields = Prisma.validator<Prisma.ProcedureArgs>()({
	include: { fields: true }
});
export type ProcedureWithFields = Prisma.ProcedureGetPayload<
	typeof procedureWithFields
>;
