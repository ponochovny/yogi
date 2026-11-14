import bcrypt from 'bcryptjs'
import { getUserByEmail } from '../../db/users'
import type { IUserResponse } from '~/server/types'
import { userTransformer } from '~/server/transformers/user'

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

		const userDto = userTransformer(user)

		// Set encrypted session cookie via nuxt-auth-utils
		await setUserSession(event, {
			user: userDto,
			loggedInAt: Date.now(),
		})

		return {
			user: userDto,
			success: true,
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
