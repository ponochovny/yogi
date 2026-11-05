import formidable from 'formidable'
import { StudioRepo } from '~/server/domains/studio'
import { PractitionerRepo } from '~/server/domains/offering'
import { MediaFileRepo } from '~/server/domains/user'
import { uploadToCloudinary } from '~/server/domains/shared'
import type { TUpdateStudioData } from '~/server/types/studio'

export default defineEventHandler(async (event) => {
	const form = formidable({})

	const formExtracted = await new Promise((resolve, reject) => {
		form.parse(event.node.req, (error, fields, files) => {
			if (error) {
				reject(error)
				return
			}
			resolve({ fields, files })
		})
	})

	const { fields, files } = formExtracted as {
		fields: { [key: string]: string[] }
		files: any
	}

	const studioData: TUpdateStudioData = {
		name: fields.name[0],
		location: fields.location[0],
		timezone: fields.timezone[0],
		currency: fields.currency[0],
		categories: fields.categories[0].split(','),
		types: fields.types[0].split(','),
		bio: fields.bio[0],
		mission: fields.mission[0],
	}

	const studio = await StudioRepo.update(studioData, fields.studio_id[0])

	// Practitioners
	if (fields['practitioners[]']) {
		const practitionerPromises = Object.keys(fields['practitioners[]']).map(
			async (key: string) => {
				const exist = await PractitionerRepo.findByStudioId(
					fields['practitioners[]'][key as any],
					studio.id
				)
				if (exist) return

				return PractitionerRepo.attachToStudio({
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

		return MediaFileRepo.create({
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
