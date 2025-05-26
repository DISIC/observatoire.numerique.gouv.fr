import { NextApiRequest, NextApiResponse } from 'next';
import { Field, Prisma, PrismaClient, Procedure } from '@prisma/client';
import { verifyAuth } from '@/utils/tools';

const prisma = new PrismaClient();

export async function getProcedures(
	editionId?: string,
	search?: string,
	sort?: string,
	department?: string,
	administration?: string
) {
	let tmpEditionId = editionId;

	if (!tmpEditionId) {
		const editions = await prisma.edition.findMany({
			orderBy: [
				{
					created_at: 'desc'
				}
			]
		});
		tmpEditionId = editions[0]?.id;
	}

	// Récupération de toutes les procédures de l'édition sans filtres complexes
	const procedures = await prisma.procedure.findMany({
		include: { fields: true, edition: true }
	});

	// Filtrage post-requête - Edition
	let filteredProcedures = procedures.filter((proc: Procedure) => 
		proc.editionId === tmpEditionId || proc.editionId === null
	);

	// Filtrage par ministère (department)
	if (department && department !== 'all') {
		filteredProcedures = filteredProcedures.filter(
			(procedure: Procedure) => procedure.ministere === department
		);
	}

	// Filtrage par administration
	if (administration && administration !== 'all') {
		filteredProcedures = filteredProcedures.filter(
			(procedure: Procedure) => procedure.administration === administration
		);
	}

	// Filtrage par recherche textuelle
	if (search && search.trim() !== '') {
		const searchLower = search.toLowerCase();
		filteredProcedures = filteredProcedures.filter(
			(procedure: Procedure) =>
				procedure.title.toLowerCase().includes(searchLower) ||
				procedure.title_normalized.toLowerCase().includes(searchLower) ||
				procedure.ministere.toLowerCase().includes(searchLower) ||
				procedure.sousorg.toLowerCase().includes(searchLower) ||
				procedure.administration.toLowerCase().includes(searchLower)
		);
	}

	// Tri des résultats
	if (sort) {
		const values = sort.split(':');
		if (values.length === 2) {
			const [field, direction] = values;
			filteredProcedures.sort((a: Procedure, b: Procedure) => {
				// Gestion des valeurs nulles ou undefined
				if (a[field as keyof Procedure] === null || a[field as keyof Procedure] === undefined) return direction === 'asc' ? -1 : 1;
				if (b[field as keyof Procedure] === null || b[field as keyof Procedure] === undefined) return direction === 'asc' ? 1 : -1;

				// Tri selon le type de données
				if (typeof a[field as keyof Procedure] === 'string') {
					return direction === 'asc'
						? (a[field as keyof Procedure] as string).localeCompare(b[field as keyof Procedure] as string)
						: (b[field as keyof Procedure] as string).localeCompare(a[field as keyof Procedure] as string);
				} else {
					return direction === 'asc'
						? (a[field as keyof Procedure] as number) - (b[field as keyof Procedure] as number)
						: (b[field as keyof Procedure] as number) - (a[field as keyof Procedure] as number);
				}
			});
		}
	} else {
		// Tri par défaut par volume décroissant
		filteredProcedures.sort((a: Procedure, b: Procedure) => {
			// Gestion des valeurs nulles ou undefined
			if (a.volume === null || a.volume === undefined) return 1;
			if (b.volume === null || b.volume === undefined) return -1;
			return (b.volume as number) - (a.volume as number);
		});
	}

	return filteredProcedures;
}

export async function getProcedureById(id: string) {
	const procedure = await prisma.procedure.findUnique({
		where: { id },
		include: { fields: true }
	});
	return procedure;
}

export async function createProcedure(data: Omit<Procedure, 'id'>) {
	const { editionId, ...rest } = data;
	const procedure = await prisma.procedure.create({
		data: {
			...rest,
			edition: { connect: { id: editionId as string } }
		},
		include: { fields: true }
	});
	return procedure;
}

export async function updateProcedure(id: string, data: Procedure) {
	const { editionId, ...rest } = data;
	const procedure = await prisma.procedure.update({
		where: { id },
		data: {
			...rest,
			edition: { connect: { id: editionId as string } }
		},
		include: { fields: true, edition: true }
	});
	return procedure;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const protectedMethods = ['POST', 'PUT', 'DELETE']; // You can customize this per route
	const isAuthorized = await verifyAuth(req, { protectedMethods });
	if (!isAuthorized && protectedMethods.includes(req.method || '')) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	if (req.method === 'GET') {
		const { id, editionId, search, sort, department, administration } =
			req.query;
		if (id) {
			const procedure = await getProcedureById(id.toString());
			res.status(200).json(procedure);
		} else {
			const procedures = await getProcedures(
				editionId as string,
				search as string,
				sort as string,
				department as string,
				administration as string
			);
			res.status(200).json(procedures);
		}
	} else if (req.method === 'POST') {
		const { fields, id, ...rest } = JSON.parse(req.body);
		const createFields = fields.map((f: Field) => {
			const { id, procedureId, ...rest } = f;
			return rest;
		});
		const procedure = await createProcedure({
			...rest,
			fields: { create: createFields }
		});
		res.status(201).json(procedure);
	} else if (req.method === 'PUT') {
		const { id } = req.query;

		const { fields, ...rest } = req.body;
		const procedure = await updateProcedure(id as string, {
			...rest,
			fields: { create: fields }
		});
		res.status(200).json(procedure);
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
