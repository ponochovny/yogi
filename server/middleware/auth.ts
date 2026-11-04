import UrlPattern from 'url-pattern'
import { verifyAccessToken } from '../utils/jwt'
import { getUserById } from '../db/users'

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

/**
 * Extracts access token from Authorization header
 */
const extractAccessToken = (event: any): string | null => {
	const authHeader = event.node.req.headers['authorization']
	if (!authHeader) return null

	const parts = authHeader.split(' ')
	if (parts.length !== 2 || parts[0] !== 'Bearer') return null

	return parts[1]
}

export default defineEventHandler(async (event) => {
	const url = event.node.req.url || ''

	// Check if current route is protected
	if (!isProtectedEndpoint(url)) {
		return
	}

	try {
		// Extract access token
		const accessToken = extractAccessToken(event)

		if (!accessToken) {
			throw createError({
				statusCode: 401,
				statusMessage: 'Authorization token is missing',
			})
		}

		// Verify token
		const decoded = verifyAccessToken(accessToken)

		if (!decoded) {
			throw createError({
				statusCode: 401,
				statusMessage: 'Authorization token is invalid or expired',
			})
		}

		// Get user
		const user = await getUserById(decoded.userId)

		if (!user) {
			throw createError({
				statusCode: 401,
				statusMessage: 'User not found',
			})
		}

		// Store user in event context
		event.context.auth = { user }
	} catch (error: any) {
		if (error.statusCode) {
			throw error
		}

		console.error('Auth middleware error:', error)
		throw createError({
			statusCode: 401,
			statusMessage: 'Unauthorized',
		})
	}
})
