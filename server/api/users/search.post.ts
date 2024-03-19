import { getUsersByString } from '~/server/db/users'
import { userSearchTransformerRaw } from '~/server/transformers/user'

export default defineEventHandler(async (event) => {
	const { search } = await readBody(event)

	const users = await getUsersByString(search)

	if (!users) {
		return { data: null, status: 'Not found' }
	}

	return {
		// @ts-ignore
		data: users.map((user) => userSearchTransformerRaw(user)),
		status: 'Success!',
	}
})
