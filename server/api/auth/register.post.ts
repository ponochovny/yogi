import { registerSchema, AuthService } from '~/server/domains/auth'

export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	const parsed = registerSchema.safeParse(body)
	if (!parsed.success) {
		throw createError({
			statusCode: 400,
			statusMessage: parsed.error.issues[0]?.message ?? 'Invalid request data',
		})
	}

	const userDto = await AuthService.createAccount(parsed.data)

	// Set encrypted session cookie via nuxt-auth-utils
	await setUserSession(event, {
		user: userDto,
		loggedInAt: Date.now(),
	})

	return {
		user: userDto,
		success: true,
	}
})
