import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getDepartments(
	kind: 'base' | 'old' = 'base',
	editionId?: string
) {
	try {
		// Approche modifiée pour éviter l'utilisation des opérateurs $and
		if (kind === 'old') {
			// Pour les anciennes procédures
			const oldProcedures = await prisma.oldProcedure.findMany({
				select: { ministere: true }
			});
			
			// Traitement manuel des données pour remplacer groupBy
			const uniqueMinisteres = [...new Set(oldProcedures.map(p => p.ministere))].filter(Boolean);
			return uniqueMinisteres.sort();
		} else {
			// Pour les procédures actuelles
			// 1. Récupérer toutes les procédures sans filtrage
			const procedures = await prisma.procedure.findMany({
				select: { ministere: true, editionId: true }
			});
			
			// 2. Filtrer par editionId en mémoire si nécessaire
			const filteredProcedures = editionId 
				? procedures.filter(p => p.editionId === editionId)
				: procedures;
			
			// 3. Extraire les ministères uniques et les trier
			const uniqueMinisteres = [...new Set(filteredProcedures.map(p => p.ministere))].filter(Boolean);
			return uniqueMinisteres.sort();
		}
	} catch (error) {
		console.error("Erreur lors de la récupération des départements:", error);
		return [];
	}
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		const { kind, editionId } = req.query;
		const departments = await getDepartments(
			kind as 'base' | 'old',
			editionId as string | undefined
		);
		res.status(200).json(departments);
	} else {
		res.status(400).json({ message: 'Unsupported method' });
	}
}
