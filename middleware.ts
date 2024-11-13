// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	const token = await getToken({
		cookieName: process.env.NEXTAUTH_COOKIENAME,
		req: request,
		secret: process.env.JWT_SECRET
	});

	if (request.nextUrl.pathname.startsWith('/administration/login') && !!token) {
		return NextResponse.redirect(
			new URL('/administration/bo/airtable', request.url)
		);
	} else if (
		request.nextUrl.pathname.startsWith('/administration/bo') &&
		!token
	) {
		return NextResponse.redirect(new URL('/administration/login', request.url));
	}

	if (
		request.nextUrl.pathname === '/administration' ||
		request.nextUrl.pathname === '/administration/bo'
	) {
		return NextResponse.redirect(new URL('/administration/login', request.url));
	}
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: '/administration/:path*'
};
