import bcrypt from 'bcryptjs'
import { getUserByEmail } from '../../db/users'
import { generateTokens, sendRefreshToken } from '~/server/utils/jwt'
import type { IUserResponse } from '~/server/types'
import { userTransformer } from '~/server/transformers/user'
import {
	createRefreshToken,
	deleteRefreshToken,
} from '~/server/db/refreshTokens'

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event)

		const { email, password } = body

		// Validate input parameters
		if (!email || !password) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Email and password are required',
			})
		}

		// Check if user exists
		const user: IUserResponse | null = await getUserByEmail(email)

		if (!user) {
			throw createError({
				statusCode: 401,
				statusMessage: 'Invalid email or password',
			})
		}

		// Verify password
		const isPasswordValid = await bcrypt.compare(password, user.password)

		if (!isPasswordValid) {
			throw createError({
				statusCode: 401,
				statusMessage: 'Invalid email or password',
			})
		}

		// Generate tokens
		const { accessToken, refreshToken } = generateTokens(user)

		// Delete old refresh token if it exists
		const oldRefreshToken = getCookie(event, 'refresh_token')
		if (oldRefreshToken) {
			try {
				await deleteRefreshToken(oldRefreshToken)
			} catch (error) {
				// Token already deleted or doesn't exist - that's ok
			}
		}

		// Save new refresh token to database
		await createRefreshToken({
			token: refreshToken,
			userId: user.id,
		})

		// Send refresh token as HTTP-only cookie
		sendRefreshToken(event, refreshToken)

		return {
			user: userTransformer(user),
			access_token: accessToken,
		}
	} catch (error: any) {
		if (error.statusCode) {
			throw error
		}

		console.error('Login error:', error)
		throw createError({
			statusCode: 500,
			statusMessage: 'An error occurred during login',
		})
	}
})
