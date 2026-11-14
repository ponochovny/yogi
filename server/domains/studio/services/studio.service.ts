import { generateSlug } from '~/src/shared/lib/utils'
import { requireFormField, uploadToCloudinary } from '~/server/domains/shared'
import { StudioRepo } from '../repositories/studio.repo'
import { PractitionerRepo } from '~/server/domains/offering'
import { MediaFileRepo } from '~/server/domains/user'
import type { TCreateStudioData } from '~/server/types/studio'
import type { IMediaFile } from '~/server/types'

export const StudioService = {
	createStudio: async (
		fields: Record<string, string[] | undefined>,
		files: any,
		userId: string
	) => {
		const name = requireFormField(fields, 'name')
		const slug = generateSlug(name)

		const studioData: TCreateStudioData = {
			name,
			slug,
			location: requireFormField(fields, 'location'),
			timezone: requireFormField(fields, 'timezone'),
			currency: requireFormField(fields, 'currency'),
			categories: requireFormField(fields, 'categories').split(','),
			types: requireFormField(fields, 'types').split(','),
			bio: requireFormField(fields, 'bio'),
			mission: requireFormField(fields, 'mission'),
			ownerId: userId,
		}

		const studio = await StudioRepo.create(studioData)

		const practitioners = fields['practitioners[]'] ?? []
		if (practitioners.length) {
			const practitionerPromises = practitioners.map((practitionerId) =>
				PractitionerRepo.attachToStudio({
					userId: practitionerId,
					studioId: studio.id,
				})
			)
			await Promise.all(practitionerPromises)
		}

		const filePromises = Object.keys(files).map(async (key) => {
			const file = files[key]?.[0]
			if (!file) return
			const cloudinaryResource = await uploadToCloudinary(file.filepath)

			const mediaFile: IMediaFile = {
				url: cloudinaryResource.secure_url,
				providerPublicId: cloudinaryResource.public_id,
			}
			if (key === 'logo') mediaFile.logoStudioId = studio.id
			if (key === 'banner') mediaFile.bannerStudioId = studio.id

			return MediaFileRepo.create(mediaFile)
		})

		await Promise.all(filePromises)

		return { data: studio, status: 'Success!' }
	},
}
