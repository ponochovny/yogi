import formidable from 'formidable'
import { StudioRepo } from '~/server/domains/studio'
import { PractitionerRepo } from '~/server/domains/offering'
import { MediaFileRepo } from '~/server/domains/user'
import { requireFormField, uploadToCloudinary } from '~/server/domains/shared'
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
		fields: Record<string, string[] | undefined>
		files: any
	}

	const studioData: TUpdateStudioData = {
		name: requireFormField(fields, 'name'),
		location: requireFormField(fields, 'location'),
		timezone: requireFormField(fields, 'timezone'),
		currency: requireFormField(fields, 'currency'),
		categories: requireFormField(fields, 'categories').split(','),
		types: requireFormField(fields, 'types').split(','),
		bio: requireFormField(fields, 'bio'),
		mission: requireFormField(fields, 'mission'),
	}

	const studio = await StudioRepo.update(
		studioData,
		requireFormField(fields, 'studio_id')
	)

	// Practitioners
	const practitioners = fields['practitioners[]'] ?? []
	if (practitioners.length) {
		const practitionerPromises = practitioners.map(async (userId) => {
			const exist = await PractitionerRepo.findByStudioId(userId, studio.id)
			if (exist) return

			return PractitionerRepo.attachToStudio({
				userId,
				studioId: studio.id,
			})
		})
		await Promise.all(practitionerPromises)
	}

	// Media files
	const filePromises = Object.keys(files).map(async (key) => {
		const file = files[key]?.[0]
		if (!file) return
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
