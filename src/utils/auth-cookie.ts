// Doit valoir « payload-token » pour partager la session entre /admin et /administration
export const AUTH_COOKIE_NAME =
	process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || 'payload-token';

export const isSecureCookie = () => process.env.NODE_ENV !== 'development';

// Valeur insérée dans Set-Cookie : caractères d'un JWT uniquement
const JWT_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

export const isWellFormedJwt = (value: unknown): value is string =>
	typeof value === 'string' && JWT_PATTERN.test(value);

export const getAuthCookieMaxAge = (exp: number | undefined) =>
	typeof exp === 'number'
		? Math.max(0, exp - Math.floor(Date.now() / 1000))
		: 0;

export const getAuthCookieOptions = (maxAge: number) => ({
	httpOnly: true,
	secure: isSecureCookie(),
	sameSite: 'strict' as const,
	path: '/',
	maxAge
});

const serialize = (name: string, value: string, maxAge: number) =>
	[
		`${name}=${value}`,
		'Path=/',
		`Max-Age=${maxAge}`,
		`Expires=${new Date(Date.now() + maxAge * 1000).toUTCString()}`,
		'HttpOnly',
		...(isSecureCookie() ? ['Secure'] : []),
		'SameSite=Strict'
	].join('; ');

export const serializeAuthCookie = (
	token: string,
	exp: number | undefined,
	name: string = AUTH_COOKIE_NAME
) => {
	if (!isWellFormedJwt(token)) throw new Error('Invalid token format');
	return serialize(name, token, getAuthCookieMaxAge(exp));
};

export const serializeExpiredAuthCookie = (name: string = AUTH_COOKIE_NAME) =>
	serialize(name, '', 0).replace(
		/Expires=[^;]+/,
		'Expires=Thu, 01 Jan 1970 00:00:00 GMT'
	);
