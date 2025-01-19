import type { H3Event, EventHandlerRequest } from 'h3'
import {
	createMediaFile,
	deleteManyMediaFilesByUserID,
} from '~/server/db/mediaFiles'
import { getUserByEmail } from '~/server/db/users'
import { extractForm } from '~/server/helpers'

export default () => {
	async function extractFields(event: H3Event<EventHandlerRequest>) {
		const { fields, files } = await extractForm<
			Promise<{
				fields: { [key: string]: string } & { studioId: string }
				files: any
			}>
		>(event)

		const { userId, name, email, bio, interestsCategory, interestsType } =
			fields

		const avatar = files['avatar'] ? files['avatar'][0] : undefined

		return {
			email,
			name,
			bio,
			userId,
			interestsCategory,
			interestsType,
			avatar,
		}
	}

	async function errorsChecker(
		event: H3Event<EventHandlerRequest>,
		userId: string | undefined,
		name: string | undefined,
		email: string | undefined
	) {
		if (!userId) {
			throw createError({
				statusCode: 400,
				statusMessage: 'No user id provided',
			})
		}

		if (email) {
			if (!name) {
				throw createError({ statusCode: 400, statusMessage: 'Invalid params' })
			}

			const user = await getUserByEmail(email)

			if (user && user.id !== userId) {
				throw createError({ statusCode: 400, statusMessage: 'Email is taken' })
			}
		}
	}

	async function updateAvatar(avatar: any | undefined, userId: string) {
		let profileImage: string | undefined
		console.log('updateAvatar 1')

		if (avatar) {
			console.log('updateAvatar 2')
			const cloudinaryResource = (await uploadToCloudinary(
				avatar.filepath
			)) as ICloudinaryResource
			console.log('updateAvatar 3')

			await deleteManyMediaFilesByUserID(userId || '')
			console.log('updateAvatar 4')

			await createMediaFile({
				url: cloudinaryResource.secure_url,
				providerPublicId: cloudinaryResource.public_id,
				userId,
			})
			console.log('updateAvatar 5')

			if (cloudinaryResource) {
				console.log('updateAvatar 6')
				profileImage = cloudinaryResource.secure_url
			}
		}
		console.log('updateAvatar 7')

		return { profileImage }
	}

	return { extractFields, errorsChecker, updateAvatar }
}
