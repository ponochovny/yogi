import { getUserById } from '~/server/db/users'
import { userTransformer } from '~/server/transformers/user'

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, 'id')

	if (!id) {
		throw createError({
			status: 400,
			message: 'User id is missing',
		})
	}

	const user = await getUserById(id)

	if (!user) {
		throw createError({
			status: 500,
			message: 'User not found',
		})
	}

	return {
		data: userTransformer(user),
		status: 'Success!',
	}
})
