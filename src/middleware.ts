// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/utils/auth-cookie';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	const jwtCookie = request.cookies.get(AUTH_COOKIE_NAME);

	if (
		request.nextUrl.pathname.startsWith('/administration/login') &&
		!!jwtCookie
	) {
		return NextResponse.redirect(
			new URL('/administration/bo/grist', request.url)
		);
	} else if (
		request.nextUrl.pathname.startsWith('/administration/bo') &&
		!jwtCookie
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
