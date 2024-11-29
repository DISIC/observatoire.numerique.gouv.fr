import { Payload, getPayload } from "payload";
import config from "./payload.config";
/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 *
 * Source: https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/lib/dbConnect.js
 */
let cached: {
	client: Payload | null;
	promise: Promise<Payload> | null;
} = (global as any).payload;

if (!cached) {
	cached = (global as any).payload = { client: null, promise: null };
}

interface Args {
	seed?: boolean;
}

export const getPayloadClient = async (args: Args): Promise<Payload> => {
	if (cached.client) {
		return cached.client;
	}

	if (!cached.promise) {
		cached.promise = getPayload({
			config: config
		});
	}

	try {
		cached.client = await cached.promise;
	} catch (e) {
		cached.promise = null;
		throw e;
	}

	return cached.client;
};

export default getPayloadClient;