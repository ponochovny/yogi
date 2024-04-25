import type { IUserResponse } from '~/server/types'
import { createUser } from '../../db/users'
import { userTransformer } from '~/server/transformers/user'
import { createRefreshToken } from '~/server/db/refreshTokens'

export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	const { name, email, password, repeatPassword } = body

	if (!name || !email || !password || !repeatPassword) {
		return sendError(
			event,
			createError({ statusCode: 400, statusMessage: 'Invalid params' })
		)
	}

	if (password !== repeatPassword) {
		return sendError(
			event,
			createError({ statusCode: 400, statusMessage: 'Password do not match' })
		)
	}

	const userData: Pick<
		IUserResponse,
		'name' | 'email' | 'password' | 'profileImage'
	> = {
		name,
		email,
		password,
		profileImage: 'https://picsum.photos/200/200',
	}

	const user = await createUser(userData)

	// Generate Tokens
	// Access token
	// Refresh token
	const { accessToken, refreshToken } = generateTokens(user)

	// Save it inside db
	await createRefreshToken({
		token: refreshToken,
		userId: user.id,
	})

	// Add http only cookie
	sendRefreshToken(event, refreshToken)

	return {
		user: userTransformer(user),
		access_token: accessToken,
	}
})
