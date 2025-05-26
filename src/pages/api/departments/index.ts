import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Définition des types pour éviter les erreurs TypeScript
interface MinistereRecord {
  ministere: string | null;
  editionId?: string | null;
}

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
			}) as MinistereRecord[];
			
			// Traitement manuel des données pour remplacer groupBy
			// Utilisation de Array.from() au lieu de la syntaxe d'étalement (...)
			const ministereSet = new Set<string>();
			oldProcedures.forEach((p: MinistereRecord) => {
				if (p.ministere) ministereSet.add(p.ministere);
			});
			
			const uniqueMinisteres = Array.from(ministereSet).sort();
			return uniqueMinisteres;
		} else {
			// Pour les procédures actuelles
			// 1. Récupérer toutes les procédures sans filtrage
			const procedures = await prisma.procedure.findMany({
				select: { ministere: true, editionId: true }
			}) as MinistereRecord[];
			
			// 2. Filtrer par editionId en mémoire si nécessaire
			const filteredProcedures = editionId 
				? procedures.filter((p: MinistereRecord) => p.editionId === editionId)
				: procedures;
			
			// 3. Extraire les ministères uniques et les trier
			const ministereSet = new Set<string>();
			filteredProcedures.forEach((p: MinistereRecord) => {
				if (p.ministere) ministereSet.add(p.ministere);
			});
			
			const uniqueMinisteres = Array.from(ministereSet).sort();
			return uniqueMinisteres;
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
