import { generateSlug } from '~/src/shared/lib/utils'
import { uploadToCloudinary } from '~/server/domains/shared'
import { StudioRepo } from '../repositories/studio.repo'
import { PractitionerRepo } from '~/server/domains/offering'
import { MediaFileRepo } from '~/server/domains/user'
import type { TCreateStudioData } from '~/server/types/studio'
import type { IMediaFile } from '~/server/types'

export const StudioService = {
	createStudio: async (
		fields: { [key: string]: string[] },
		files: any,
		userId: string
	) => {
		const slug = generateSlug(fields.name[0])

		const studioData: TCreateStudioData = {
			name: fields.name[0],
			slug,
			location: fields.location[0],
			timezone: fields.timezone[0],
			currency: fields.currency[0],
			categories: fields.categories[0].split(','),
			types: fields.types[0].split(','),
			bio: fields.bio[0],
			mission: fields.mission[0],
			ownerId: userId,
		}

		const studio = await StudioRepo.create(studioData)

		if (fields[`practitioners[]`]) {
			const practitionerPromises = Object.keys(fields[`practitioners[]`]).map(
				(key: string) =>
					PractitionerRepo.attachToStudio({
						userId: fields[`practitioners[]`][key as any],
						studioId: studio.id,
					})
			)
			await Promise.all(practitionerPromises)
		}

		const filePromises = Object.keys(files).map(async (key) => {
			const file = files[key][0]
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

