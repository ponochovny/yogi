import UrlPattern from 'url-pattern'

/**
 * Protected routes that require authentication
 */
const PROTECTED_ENDPOINTS = [
	'/api/auth/user',
	'/api/auth/updateProfile',
	'/api/studios',
	'/api/admin/studios',
	'/api/offerings',
]

/**
 * Checks if the route is protected
 */
const isProtectedEndpoint = (url: string): boolean => {
	return PROTECTED_ENDPOINTS.some((endpoint) => {
		const pattern = new UrlPattern(endpoint)
		return pattern.match(url || '')
	})
}

export default defineEventHandler(async (event) => {
	const session = await getUserSession(event)

	// Attach authenticated user to event context for backward compatibility
	if (session?.user) {
		event.context.auth = { user: session.user }
	}

	const url = event.node.req.url || ''

	// Enforce authentication on protected endpoints
	if (isProtectedEndpoint(url) && !session?.user) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Unauthorized: Session required',
		})
	}
})
