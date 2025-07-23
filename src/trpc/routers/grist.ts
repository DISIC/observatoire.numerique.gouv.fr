import { ProcedureWithFields } from '@/pages/api/procedures/types';
import { api } from '@/utils/grist';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { getFieldsFromGristProcedure, grist_field_names } from './utils';

export type GristEdition = { id: number; name: string; start_date: string; end_date: string }

export const grist = router({
	getEditions: protectedProcedure.query(async ({ ctx, input }) => {
		const gristEditions = await api.fetchTable(process.env.GRIST_TABLE_EDITION);

		const editions: GristEdition[] = gristEditions
			.sort((a: any, b: any) => new Date(b['Date_Fin_Edition']).getTime() - new Date(a['Date_Fin_Edition']).getTime())
			.map((edition: any) => ({
				id: edition['id'],
				name: edition['Nom_Edition'],
				start_date: edition['Date_Debut_Edition'] * 1000,
				end_date: edition['Date_Fin_Edition'] * 1000
			}));

		return { data: editions };
	}),
	getProcedures: protectedProcedure.input(z.object({ edition: z.number() })).query(async ({ ctx, input }) => {
		const { docs: indicators } = await ctx.payload.find({
			collection: 'payload-indicators',
			limit: 1000
		});

		const { edition } = input;

		const gristProcedures = await api.fetchTable(process.env.GRIST_TABLE_PROCEDURES, { Ref_Edition: [edition] });

		const gristAdministrationCentral = await api.fetchTable(process.env.GRIST_TABLE_ADMINISTRATIONS_CENTRAL);

		const gristAdministrationCentralMap = gristAdministrationCentral.reduce((acc: Record<number, string>, administrationCentral: any) => {
			acc[administrationCentral['id']] = administrationCentral['Nom_Administration_Centrale'];
			return acc;
		}, {});

		const procedures: ProcedureWithFields[] = gristProcedures.map((gristProcedure: any) => {
			const title = gristProcedure[grist_field_names.title].replace(/(?:\uD83D\uDCC4|#)/g, '').trim();
			const administrationCentralId = gristProcedure[grist_field_names.administration_central];
			const administrationCentralName = gristAdministrationCentralMap[administrationCentralId] || '';

			return {
				id: `preview-${gristProcedure[grist_field_names.id]}`,
				editionId: null,
				title,
				title_normalized: title.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
				administration: gristProcedure[grist_field_names.administration],
				administration_central: administrationCentralName,
				sousorg: gristProcedure[grist_field_names.sousorg],
				ministere: gristProcedure[grist_field_names.ministere],
				grist_identifier: gristProcedure[grist_field_names.id],
				jdma_identifier: gristProcedure[grist_field_names.jdma_id],
				volume: gristProcedure[grist_field_names.volume],
				noJdma: gristProcedure[grist_field_names.noJdma] !== 'Oui',
				fields: getFieldsFromGristProcedure(gristProcedure, indicators)
			};
		});

		return {
			data: procedures.sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0))
		};
	}),
});
