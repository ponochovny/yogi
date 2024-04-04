import bcrypt from 'bcryptjs'
import { getUserByEmail } from '../../db/users'
import { generateTokens, sendRefreshToken } from '~/server/utils/jwt'
import type { IUser } from '~/server/types'
import { userTransformer } from '~/server/transformers/user'
import { createRefreshToken, getRefreshToken } from '~/server/db/refreshTokens'

export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	const { email, password } = body

	if (!email || !password) {
		return sendError(
			event,
			createError({ statusCode: 400, statusMessage: 'Invalid params' })
		)
	}

	// Is the user registered
	const user: IUser | null = await getUserByEmail(email)

	if (!user) {
		return sendError(
			event,
			createError({
				statusCode: 400,
				statusMessage: 'Email or password is invalid',
			})
		)
	}

	// Compare passwords
	const doesThePasswordMatch = await bcrypt.compare(password, user.password)

	if (!doesThePasswordMatch) {
		return sendError(
			event,
			createError({
				statusCode: 400,
				statusMessage: 'Email or password is invalid',
			})
		)
	}

	// Generate Tokens
	// Access token
	// Refresh token
	const { accessToken, refreshToken } = generateTokens(user)

	const isRTExists = await getRefreshToken(refreshToken)

	if (!isRTExists) {
		// Save it inside db
		await createRefreshToken({
			token: refreshToken,
			userId: user.id,
		})
	}

	// Add http only cookie
	sendRefreshToken(event, refreshToken)

	return {
		user: userTransformer(user),
		access_token: accessToken,
	}
})
