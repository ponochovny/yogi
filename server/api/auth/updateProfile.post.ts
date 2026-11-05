import { UserService } from '~/server/domains/user'
import { extractForm } from '~/server/domains/shared'

export default defineEventHandler(async (event) => {
	try {
		const { fields, files } = await extractForm<{
			fields: { [key: string]: string } & { studioId: string }
			files: any
		}>(event)

		const { userId, name, email, bio, interestsCategory, interestsType } = fields
		const avatar = files?.avatar ? files.avatar[0] : undefined

		const result = await UserService.updateProfile(
			userId,
			{ name, email, bio, interestsCategory, interestsType },
			avatar
		)

		return result
	} catch (e: any) {
		throw createError({
			statusCode: e.statusCode || 500,
			statusMessage: e.message || e.statusMessage || 'Some error occurred',
		})
	}
})
