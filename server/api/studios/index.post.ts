import formidable from 'formidable'
import type { IStudio } from '~/helpers/types/studio'
import { generateSlug } from '~/lib/utils'
import { createMediaFile, type IMediaFile } from '~/server/db/mediaFiles'
import { attachPractitionerToStudio } from '~/server/db/practitioners'
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

	const slug = generateSlug(fields.name[0])

	const studioData: Pick<
		IStudio,
		| 'bio'
		| 'currency'
		| 'mission'
		| 'name'
		| 'slug'
		| 'timezone'
		| 'ownerId'
		| 'categories'
		| 'types'
		| 'location'
	> = {
		name: fields.name[0],
		slug,
		location: [fields.location[0]],
		timezone: fields.timezone[0],
		currency: fields.currency[0],
		categories: fields.categories[0].split(','),
		types: fields.types[0].split(','),
		// tags: [fields.tags[0]],
		bio: fields.bio[0],
		mission: fields.mission[0],

		// owner
		ownerId: userId,
	}

	const studio = await createStudio(studioData)

	// Practitioners
	const practitionerPromises = Object.keys(fields[`practitioners[]`]).map(
		async (key: string) => {
			return attachPractitionerToStudio({
				userId: fields[`practitioners[]`][key],
				studioId: studio.id,
			})
		}
	)

	await Promise.all(practitionerPromises)

	// Media files
	const filePromises = Object.keys(files).map(async (key) => {
		const file = files[key][0]

		const cloudinaryResource = await uploadToCloudinary(file.filepath)

		const mediaFile: IMediaFile = {
			url: cloudinaryResource.secure_url,
			providerPublicId: cloudinaryResource.public_id,
		}
		if (key === 'logo') {
			mediaFile.logoStudioId = studio.id
		}
		if (key === 'banner') {
			mediaFile.bannerStudioId = studio.id
		}

		return createMediaFile(mediaFile)
	})

	await Promise.all(filePromises)

	return {
		data: studio,
		status: 'Success!',
	}
})
