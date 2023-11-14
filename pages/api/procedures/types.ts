import { Prisma } from '@prisma/client';

const procedureWithFields = Prisma.validator<Prisma.ProcedureArgs>()({
	include: { fields: true }
});
export type ProcedureWithFields = Prisma.ProcedureGetPayload<
	typeof procedureWithFields
>;

const procedureWithFieldsAndEditions = Prisma.validator<Prisma.ProcedureArgs>()(
	{
		include: { fields: true, edition: true }
	}
);
export type ProcedureWithFieldsAndEditions = Prisma.ProcedureGetPayload<
	typeof procedureWithFieldsAndEditions
>;
