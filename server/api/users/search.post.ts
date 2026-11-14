import { UserRepo, toUserSearchDto } from '~/server/domains/user'

export default defineEventHandler(async (event) => {
	const { search } = await readBody<{ search?: string }>(event)
	if (typeof search !== 'string' || !search.trim()) {
		throw createError({ statusCode: 400, statusMessage: 'Search query is required' })
	}

	const users = await UserRepo.searchByName(search)

	if (!users) {
		return { data: null, status: 'Not found' }
	}

	return {
		data: users.map(toUserSearchDto),
		status: 'Success!',
	}
})
