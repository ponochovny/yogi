import { UserRepo, toUserDto } from '~/server/domains/user'

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, 'id')

	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: 'User id is missing',
		})
	}

	const user = await UserRepo.findById(id)

	if (!user) {
		throw createError({
			statusCode: 404,
			statusMessage: 'User not found',
		})
	}

	return {
		data: toUserDto(user),
		status: 'Success!',
	}
})
