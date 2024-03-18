import { getUsersByString } from '~/server/db/users'
import { userSearchTransformer } from '~/server/transformers/user'

export default defineEventHandler(async (event) => {
	const { search } = await readBody(event)

	const users = await getUsersByString(search)

	if (!users) {
		return { data: null, status: 'Not found' }
	}

	return {
		// @ts-ignore
		data: users.map((user) => userSearchTransformer(user)),
		status: 'Success!',
	}
})
