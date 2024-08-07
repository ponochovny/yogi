import formidable from 'formidable'
import { createMediaFile } from '~/server/db/mediaFiles'
import {
	attachPractitionerToStudio,
	getPractitionerByStudioID,
} from '~/server/db/practitioners'
import { updateStudio } from '~/server/db/studio'
import type { TUpdateStudioData } from '~/server/types/studio'
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

	const { fields, files } = formExtracted as {
		fields: { [key: string]: string[] }
		files: any
	}

	// const userId = event.context.auth.user.id

	const studioData: TUpdateStudioData = {
		name: fields.name[0],
		location: fields.location[0],
		timezone: fields.timezone[0],
		currency: fields.currency[0],
		categories: fields.categories[0].split(','),
		types: fields.types[0].split(','),
		// tags: [fields.tags[0]],
		bio: fields.bio[0],
		mission: fields.mission[0],

		// owner
		// ownerId: userId,
	}

	const studio = await updateStudio(studioData, fields.studio_id[0])

	// Practitioners
	// TODO: handle update
	if (fields['practitioners[]']) {
		const practitionerPromises = Object.keys(fields['practitioners[]']).map(
			async (key: string) => {
				const exist = await getPractitionerByStudioID(
					fields['practitioners[]'][key as any],
					studio.id
				)
				if (exist) return Promise.resolve()

				return attachPractitionerToStudio({
					userId: fields['practitioners[]'][key as any],
					studioId: studio.id,
				})
			}
		)
		await Promise.all(practitionerPromises)
	}

	// Media files
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
