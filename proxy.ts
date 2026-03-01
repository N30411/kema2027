
import { NextRequest, NextResponse } from "next/server"
import type { UserRole } from "./types"

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/dashboard", "/supporters", "/agents", "/wards", "/llgs", "/events", "/info/population", "/supporters/new"]

// Role-based route access
const ROLE_ROUTES: Record<UserRole, string[]> = {
	admin: [
		"/dashboard",
		"/supporters",
		"/agents",
		"/wards",
		"/llgs",
		"/events",
	],
	campaign_manager: [
		"/dashboard",
		"/supporters",
		"/agents",
		"/wards",
		"/llgs",
		"/events",
	],
	agent: ["/dashboard", "/supporters"],
}

export default async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Allow public routes, any /login path, static files, and API routes
	if (
		PUBLIC_ROUTES.includes(pathname) ||
		pathname.startsWith("/login") ||
		pathname.startsWith("/api/") ||
		pathname.startsWith("/_next/") ||
		pathname.startsWith("/favicon") ||
		pathname.startsWith("/assets/") ||
		pathname.startsWith("/public/") ||
		pathname.endsWith(".js") ||
		pathname.endsWith(".css") ||
		pathname.endsWith(".png") ||
		pathname.endsWith(".jpg") ||
		pathname.endsWith(".svg")
	) {
		return NextResponse.next()
	}

	// Check for session/auth token
	const authToken = request.cookies.get("auth_token")?.value
	const userRole = request.cookies.get("user_role")?.value as UserRole | undefined

	// No auth token - redirect to login
	if (!authToken) {
		return NextResponse.redirect(new URL("/login", request.url))
	}

	// If accessing a protected route, check role permissions
	const isProtected = !PUBLIC_ROUTES.includes(pathname)

	if (isProtected && userRole) {
		// Check if user's role has access to this route
		const allowedRoutes = ROLE_ROUTES[userRole] || []
		if (!allowedRoutes.includes(pathname)) {
			return NextResponse.redirect(new URL("/dashboard", request.url))
		}
	}

	return NextResponse.next()
}
