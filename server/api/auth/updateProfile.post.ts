import { updateProfile } from '~/server/db/users'
import { userTransformer } from '~/server/transformers/user'
import updateProfileModel from './_models/updateProfile'

const { extractFields, errorsChecker, updateAvatar } = updateProfileModel()

export default defineEventHandler(async (event) => {
	try {
		const {
			name,
			bio,
			email,
			userId,
			interestsCategory,
			interestsType,
			avatar,
		} = await extractFields(event)

		await errorsChecker(event, userId, name, email)

		const { profileImage } = await updateAvatar(avatar, userId)

		const updatedUser = await updateProfile(userId, {
			email,
			name,
			bio,
			profileImage,
			interestsType: interestsType?.split(','),
			interestsCategory: interestsCategory?.split(','),
		})
		const user = userTransformer(updatedUser)

		await setUserSession(event, { user, loggedInAt: Date.now() })

		return { user }
	} catch (e: any) {
		throw createError({
			statusCode: e.statusCode || 500,
			statusMessage: e.message || e.statusMessage || 'Some error occurred',
		})
	}
})
