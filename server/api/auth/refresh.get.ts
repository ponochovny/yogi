import { getRefreshTokenByToken } from '~/server/db/refreshTokens'
import { getUserById } from '~/server/db/users'
import { decodeRefreshToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
	const refreshToken = getCookie(event, 'refresh_token')

	if (!refreshToken) {
		return { statusCode: 200, body: { error: 'No refresh token' } }
	}

	const rToken = await getRefreshTokenByToken(refreshToken)

	if (!rToken) {
		return { statusCode: 200, body: { error: 'Refresh token is invalid' } }
	}

	const token = decodeRefreshToken(refreshToken)

	try {
		const user = await getUserById(token?.userId as string)

		if (!user)
			throw createError({
				statusCode: 400,
				statusMessage: 'User not found',
			})

		const { accessToken } = generateTokens(user)

		return { access_token: accessToken }
	} catch (error) {
		return {
			statusCode: 500,
			body: { error: 'Refresh token is invalid', details: error },
		}
	}
})
