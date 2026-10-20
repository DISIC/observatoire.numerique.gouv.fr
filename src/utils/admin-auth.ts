// Serveur uniquement (importe Payload) : chargé dynamiquement par verifyAuth
import config from '@payload-config';
import type { IncomingHttpHeaders } from 'http';
import {
	createLocalReq,
	getPayload,
	logoutOperation,
	type Payload
} from 'payload';
import { AUTH_COOKIE_NAME, isWellFormedJwt } from './auth-cookie';
import { ADMINS_SLUG } from '@/payload/auth/totp';

type RequestLike = {
	headers: IncomingHttpHeaders;
	cookies: Partial<Record<string, string>>;
};

const firstHeader = (value: string | string[] | undefined) =>
	Array.isArray(value) ? value[0] : value;

export async function getAdminFromRequest(
	req: RequestLike,
	payloadClient?: Payload
) {
	const token = req.cookies[AUTH_COOKIE_NAME];
	if (!isWellFormedJwt(token)) return null;

	const payload = payloadClient ?? (await getPayload({ config }));

	const headers = new Headers();
	headers.set('cookie', `${payload.config.cookiePrefix}-token=${token}`);
	headers.set('DisableAutologin', 'true');
	for (const name of ['origin', 'sec-fetch-site']) {
		const value = firstHeader(req.headers[name]);
		if (value) headers.set(name, value);
	}

	try {
		const { user } = await payload.auth({ headers });
		if (!user || user.collection !== ADMINS_SLUG) return null;
		return user;
	} catch {
		return null;
	}
}

export async function logoutAdminFromRequest(req: RequestLike) {
	const payload = await getPayload({ config });
	const user = await getAdminFromRequest(req, payload);
	if (!user) return false;

	const localReq = await createLocalReq({ user }, payload);
	await logoutOperation({
		collection: payload.collections[ADMINS_SLUG],
		req: localReq
	});
	return true;
}
