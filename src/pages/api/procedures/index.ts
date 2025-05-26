import { NextApiRequest, NextApiResponse } from 'next';
import { Field, Prisma, PrismaClient, Procedure } from '@prisma/client';
import { verifyAuth } from '@/utils/tools';

const prisma = new PrismaClient();

// Interface simplifiée pour éviter les erreurs TypeScript
interface ProcedureRecord {
  id: string;
  grist_identifier?: number | null;
  title: string;
  title_normalized: string;
  ministere: string;
  administration: string;
  sousorg: string;
  volume?: number | null;
  noJdma: boolean;
  editionId?: string | null;
  fields?: any[];
  edition?: any | null;
  [key: string]: any; // Pour permettre l'accès aux propriétés dynamiques
}

export async function getProcedures(
	editionId?: string,
	search?: string,
	sort?: string,
	department?: string,
	administration?: string
) {
	let tmpEditionId = editionId;

	if (!tmpEditionId) {
		try {
			const editions = await prisma.edition.findMany({
				orderBy: [
					{
						created_at: 'desc'
					}
				]
			});
			tmpEditionId = editions[0]?.id;
		} catch (error) {
			console.error("Erreur lors de la récupération des éditions:", error);
			return [];
		}
	}

	try {
		// Récupération des procédures sans filtres complexes
		const procedures = await prisma.procedure.findMany();
		
		// Récupération des champs associés (fields) séparément
		let fields: any[] = [];
		
		try {
			fields = await prisma.field.findMany();
		} catch (error) {
			console.error("Erreur lors de la récupération des champs:", error);
			// Continuer avec des champs vides si la récupération échoue
		}
		
		// Récupération des éditions séparément
		let editions: any[] = [];
		try {
			editions = await prisma.edition.findMany();
		} catch (error) {
			console.error("Erreur lors de la récupération des éditions:", error);
			// Continuer avec des éditions vides si la récupération échoue
		}
		
		// Association manuelle des champs et éditions aux procédures
		const enrichedProcedures = procedures.map((procedure: any) => {
			const procedureFields = fields.filter((f: any) => f.procedureId === procedure.id);
			const edition = editions.find((e: any) => e.id === procedure.editionId);
			
			return {
				...procedure,
				fields: procedureFields || [],
				edition: edition || null
			} as ProcedureRecord;
		});
		
		// Filtrage post-requête
		let filteredProcedures = enrichedProcedures;
		
		// Filtrage par édition
		if (tmpEditionId) {
			filteredProcedures = filteredProcedures.filter(
				(proc: ProcedureRecord) => proc.editionId === tmpEditionId
			);
		}

		// Filtrage par ministère (department)
		if (department && department !== 'all') {
			filteredProcedures = filteredProcedures.filter(
				(procedure: ProcedureRecord) => procedure.ministere === department
			);
		}

		// Filtrage par administration
		if (administration && administration !== 'all') {
			filteredProcedures = filteredProcedures.filter(
				(procedure: ProcedureRecord) => procedure.administration === administration
			);
		}

		// Filtrage par recherche textuelle
		if (search && search.trim() !== '') {
			const searchLower = search.toLowerCase();
			filteredProcedures = filteredProcedures.filter(
				(procedure: ProcedureRecord) =>
					(procedure.title && procedure.title.toLowerCase().includes(searchLower)) ||
					(procedure.title_normalized && procedure.title_normalized.toLowerCase().includes(searchLower)) ||
					(procedure.ministere && procedure.ministere.toLowerCase().includes(searchLower)) ||
					(procedure.sousorg && procedure.sousorg.toLowerCase().includes(searchLower)) ||
					(procedure.administration && procedure.administration.toLowerCase().includes(searchLower))
			);
		}

		// Tri des résultats
		if (sort) {
			const values = sort.split(':');
			if (values.length === 2) {
				const [field, direction] = values;
				filteredProcedures.sort((a: ProcedureRecord, b: ProcedureRecord) => {
					// Gestion des valeurs nulles ou undefined
					const aValue = a[field];
					const bValue = b[field];
					
					if (aValue === null || aValue === undefined) return direction === 'asc' ? -1 : 1;
					if (bValue === null || bValue === undefined) return direction === 'asc' ? 1 : -1;
					
					// Tri selon le type de données
					if (typeof aValue === 'string') {
						return direction === 'asc' 
							? aValue.localeCompare(bValue) 
							: bValue.localeCompare(aValue);
					} else {
						return direction === 'asc' 
							? aValue - bValue 
							: bValue - aValue;
					}
				});
			}
		} else {
			// Tri par défaut par volume décroissant
			filteredProcedures.sort((a: ProcedureRecord, b: ProcedureRecord) => {
				if (a.volume === null || a.volume === undefined) return 1;
				if (b.volume === null || b.volume === undefined) return -1;
				return (b.volume as number) - (a.volume as number);
			});
		}

		return filteredProcedures;
	} catch (error) {
		console.error("Erreur lors de la récupération des procédures:", error);
		return [];
	}
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
