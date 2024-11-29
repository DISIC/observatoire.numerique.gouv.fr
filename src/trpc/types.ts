import { z } from "zod";

export const ZGetListParams = z.object({
	page: z.number(),
	perPage: z.number(),
	sort: z.string().optional(),
});