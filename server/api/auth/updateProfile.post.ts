import { getUserByEmail, updateProfile } from '~/server/db/users'
import { userTransformer } from '~/server/transformers/user'

export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	const { userId, ...rest } = body

	if ('email' in body) {
		const { email, name } = body

		if (!email || !name) {
			return sendError(
				event,
				createError({ statusCode: 400, statusMessage: 'Invalid params' })
			)
		}

		const user = await getUserByEmail(email)

		if (user && user.id !== userId) {
			return sendError(
				event,
				createError({ statusCode: 400, statusMessage: 'Email is taken' })
			)
		}
	}

	// Update profile in db with userId
	const updatedUser = await updateProfile(userId, { ...rest })

	return {
		user: userTransformer(updatedUser),
	}
})
