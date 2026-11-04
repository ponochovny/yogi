import { getRefreshTokenByToken } from '~/server/db/refreshTokens'
import { getUserById } from '~/server/db/users'
import { verifyRefreshToken, generateTokens } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
	try {
		const refreshToken = getCookie(event, 'refresh_token')

		if (!refreshToken) {
			throw createError({
				statusCode: 401,
				statusMessage: 'Refresh token not found',
			})
		}

		// Check if refresh token exists in database
		const tokenRecord = await getRefreshTokenByToken(refreshToken)

		if (!tokenRecord) {
			throw createError({
				statusCode: 401,
				statusMessage: 'Refresh token is invalid or revoked',
			})
		}

		// Verify refresh token
		const decoded = verifyRefreshToken(refreshToken)

		if (!decoded) {
			throw createError({
				statusCode: 401,
				statusMessage: 'Refresh token is expired or invalid',
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

		// Generate new access token
		const { accessToken } = generateTokens(user)

		return {
			access_token: accessToken,
		}
	} catch (error: any) {
		if (error.statusCode) {
			throw error
		}

		console.error('Token refresh error:', error)
		throw createError({
			statusCode: 401,
			statusMessage: 'Failed to refresh token',
		})
	}
})
