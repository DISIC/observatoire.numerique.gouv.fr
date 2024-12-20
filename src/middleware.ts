// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	const jwtCookie = request.cookies.get(
		process.env.NEXT_PUBLIC_JWT_COOKIE_NAME ?? 'obs-jwt'
	);

	if (
		request.nextUrl.pathname.startsWith('/administration/login') &&
		!!jwtCookie
	) {
		return NextResponse.redirect(
			new URL('/administration/bo/airtable', request.url)
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
