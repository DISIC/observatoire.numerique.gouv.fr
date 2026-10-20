import { Prisma } from '@prisma/client';

// Mongo trie null comme la plus petite valeur, PostgreSQL l'inverse : on garde l'ordre de Mongo
export const orderByNullsLikeMongo = (
	model: Prisma.ModelName,
	field: string,
	direction: 'asc' | 'desc'
) => {
	const nullable = Prisma.dmmf.datamodel.models
		.find(m => m.name === model)
		?.fields.some(f => f.name === field && !f.isRequired && !f.isList);

	return {
		[field]: nullable
			? { sort: direction, nulls: direction === 'asc' ? 'first' : 'last' }
			: direction
	};
};
