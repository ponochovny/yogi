import formidable from 'formidable'
import type { IStudio } from '~/helpers/types/studio'
import { createMediaFile } from '~/server/db/mediaFiles'
import { createStudio } from '~/server/db/studio'
import { uploadToCloudinary } from '~/server/utils/cloudinary'

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

	const { fields, files } = formExtracted as { fields: any; files: any }

	const userId = event.context.auth.user.id

	const studioData: Pick<
		IStudio,
		| 'banner'
		| 'bio'
		| 'currency'
		| 'logo'
		| 'mission'
		| 'name'
		| 'timezone'
		| 'ownerId'
		| 'categories'
		| 'types'
		| 'location'
	> = {
		name: fields.name[0],
		location: [fields.location[0]],
		timezone: fields.timezone[0],
		currency: fields.currency[0],
		categories: [fields.categories[0]],
		types: [fields.types[0]],
		// tags: [fields.tags[0]],
		bio: fields.bio[0],
		mission: fields.mission[0],
		logo: [],
		banner: '',

		// owner
		ownerId: userId,
	}

	const studio = await createStudio(studioData)

	const filePromises = Object.keys(files).map(async (key) => {
		const file = files[key][0]

		const cloudinaryResource = await uploadToCloudinary(file.filepath)

		return createMediaFile({
			url: cloudinaryResource.secure_url,
			providerPublicId: cloudinaryResource.public_id,
			logoStudioId: key === 'logo' ? studio.id : null,
			bannerStudioId: key === 'banner' ? studio.id : null,
		})
	})

	await Promise.all(filePromises)

	return {
		data: studio,
		status: 'Success!',
	}
})
