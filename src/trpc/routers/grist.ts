import { ProcedureWithFields } from '@/pages/api/procedures/types';
import { api } from '@/utils/grist';
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { getFieldsFromGristProcedure, grist_field_names } from './utils';

export type GristEdition = { id: number; name: string; start_date: string; end_date: string }

export const grist = router({
	// TODO: MAKE PROTECTED PROCEDURE
	getEditions: publicProcedure.query(async ({ ctx, input }) => {
		const gristEditions = await api.fetchTable(process.env.GRIST_TABLE_EDITION);

		const editions: GristEdition[] = gristEditions
			.sort((a: any, b: any) => new Date(b['Date_Fin']).getTime() - new Date(a['Date_Fin']).getTime())
			.map((edition: any) => ({
				id: edition['id'],
				name: edition['Nom_Edition'],
				start_date: edition['Date_Debut'] * 1000,
				end_date: edition['Date_Fin'] * 1000
			}));

		return { data: editions };
	}),
	getProcedures: publicProcedure.input(z.object({ edition: z.number() })).query(async ({ ctx, input }) => {
		const { docs: indicators } = await ctx.payload.find({
			collection: 'payload-indicators',
			limit: 1000
		});

		const { edition } = input;

		const gristProcedures = await api.fetchTable(process.env.GRIST_TABLE_PROCEDURES, { Ref_Edition: [edition] });

		const procedures: ProcedureWithFields[] = gristProcedures.map((gristProcedure: any) => {
			const title = gristProcedure[grist_field_names.title].replace(/(?:\uD83D\uDCC4|#)/g, '').trim();
			return {
				id: `preview-${gristProcedure[grist_field_names.id]}`,
				editionId: null,
				title,
				title_normalized: title.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
				administration: gristProcedure[grist_field_names.administration],
				sousorg: gristProcedure[grist_field_names.sousorg],
				ministere: gristProcedure[grist_field_names.ministere],
				airtable_identifier: gristProcedure[grist_field_names.id],
				volume: gristProcedure[grist_field_names.volume],
				noJdma: gristProcedure[grist_field_names.noJdma],
				fields: getFieldsFromGristProcedure(gristProcedure, indicators)
			};
		});

		return {
			data: procedures.sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0))
		};
	}),
});
