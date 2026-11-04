import type { IUserResponse } from '~/server/types'
import { createUser, getUserByEmail } from '../../db/users'
import { userTransformer } from '~/server/transformers/user'
import { createRefreshToken } from '~/server/db/refreshTokens'
import { generateTokens, sendRefreshToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event)

		const { name, email, password, repeatPassword } = body

		// Validate input parameters
		if (!name || !email || !password || !repeatPassword) {
			throw createError({
				statusCode: 400,
				statusMessage: 'All fields are required',
			})
		}

		// Check if passwords match
		if (password !== repeatPassword) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Passwords do not match',
			})
		}

		// Check minimum password length
		if (password.length < 8) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Password must be at least 8 characters long',
			})
		}

		// Check if user with this email already exists
		const userExists = await getUserByEmail(email)

		if (userExists) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Email is already registered',
			})
		}

		// Create new user
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

		// Generate tokens
		const { accessToken, refreshToken } = generateTokens(user)

		// Save refresh token to database
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

		console.error('Registration error:', error)
		throw createError({
			statusCode: 500,
			statusMessage: 'An error occurred during registration',
		})
	}
})
