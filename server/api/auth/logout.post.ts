import { resetRefreshToken } from '~/server/utils/jwt'
import { deleteRefreshToken } from '~/server/db/refreshTokens'

export default defineEventHandler(async (event) => {
	const refreshToken = getCookie(event, 'refresh_token')

	// Delete token from db
	await deleteRefreshToken(refreshToken)

	// Remove http only cookie
	resetRefreshToken(event)

	return {
		status: 'Success!1',
	}
})
