import formidable from 'formidable'
import {
	createMediaFile,
	deleteManyMediaFileByUserID,
} from '~/server/db/mediaFiles'
import { getUserByEmail, updateProfile } from '~/server/db/users'
import { userTransformer } from '~/server/transformers/user'

export default defineEventHandler(async (event) => {
	const form = formidable({})
	const formExtracted = await new Promise((resolve, reject) => {
		form.parse(event.node.req, (error, fields, files) => {
			if (error) {
				reject(error)
			}
			resolve({ fields, files })
		})
	})
	//@ts-ignore
	const { fields, files } = formExtracted as {
		fields: { [key: string]: string[] } & { studioId: string }
		files: any
	}

	const email = fields['email'][0]
	const name = fields['name'][0]
	const userId = fields['userId'][0]

	if (email) {
		if (!email || !name) {
			return sendError(
				event,
				createError({ statusCode: 400, statusMessage: 'Invalid params' })
			)
		}

		const user = await getUserByEmail(email)

		if (user && user.id !== userId) {
			return sendError(
				event,
				createError({ statusCode: 400, statusMessage: 'Email is taken' })
			)
		}
	}

	// Update avatar
	const avatar = files['avatar'][0]

	const cloudinaryResource = await uploadToCloudinary(avatar.filepath)

	await deleteManyMediaFileByUserID(userId)

	await createMediaFile({
		url: cloudinaryResource.secure_url,
		providerPublicId: cloudinaryResource.public_id,
		userId,
	})

	// Update profile in db with userId
	const updatedUser = await updateProfile(userId, {
		name,
		email,
		profileImage: cloudinaryResource.secure_url,
	})

	return {
		user: userTransformer(updatedUser),
	}
})
