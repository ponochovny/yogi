import type { IUser } from '~/server/types'
import { createUser } from '../../db/users'
import { userTransformer } from '~/server/transformers/user'

export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	const { name, email, password, repeatPassword } = body

	if (!name || !email || !password || !repeatPassword) {
		return sendError(
			event,
			createError({ statusCode: 400, statusMessage: 'Invalid params' })
		)
	}

	if (password !== repeatPassword) {
		return sendError(
			event,
			createError({ statusCode: 400, statusMessage: 'Password do not match' })
		)
	}

	const userData: Pick<IUser, 'name' | 'email' | 'password' | 'profileImage'> =
		{
			name,
			email,
			password,
			profileImage: 'https://picsum.photos/200/200',
		}

	const user = await createUser(userData)

	return {
		body: userTransformer(user),
	}
})
