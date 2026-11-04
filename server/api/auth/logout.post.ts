import { clearRefreshToken } from '~/server/utils/jwt'
import { deleteRefreshToken } from '~/server/db/refreshTokens'

export default defineEventHandler(async (event) => {
	try {
		const refreshToken = getCookie(event, 'refresh_token')

		// Delete token from database if it exists
		if (refreshToken) {
			try {
				await deleteRefreshToken(refreshToken)
			} catch (error) {
				// Token doesn't exist in database - that's ok
				console.warn('Failed to delete refresh token from database')
			}
		}

		// Remove cookies
		clearRefreshToken(event)

		return {
			statusCode: 200,
			success: true,
		}
	} catch (error: any) {
		console.error('Logout error:', error)
		throw createError({
			statusCode: 500,
			statusMessage: 'An error occurred during logout',
		})
	}
})
