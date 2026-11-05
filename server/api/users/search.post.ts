import { UserRepo, toUserSearchDtoRaw } from '~/server/domains/user'

export default defineEventHandler(async (event) => {
	const { search } = await readBody(event)

	const users = (await UserRepo.searchByName(search)) as any[]

	if (!users) {
		return { data: null, status: 'Not found' }
	}

	return {
		data: users.map((user) => toUserSearchDtoRaw(user)),
		status: 'Success!',
	}
})
