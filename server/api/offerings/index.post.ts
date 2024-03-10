import formidable from 'formidable'
import type { IOffering } from '~/helpers/types/offering'
import { createMediaFile } from '~/server/db/mediaFiles'
import { createOffering } from '~/server/db/offerings'
import { uploadToCloudinary } from '~/server/utils/cloudinary'

type TOfferingCreation = Partial<
	Pick<
		IOffering,
		| 'name'
		| 'activity'
		| 'start'
		| 'end'
		| 'duration'
		| 'description'
		| 'spots'
		| 'is_private'
		| 'types'
		| 'categories'
		| 'location'
		| 'timezone'
	> & { studioId: string }
>

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

	// TODO: set fields types
	const { fields, files } = formExtracted as {
		fields: any & { studioId: string }
		files: any
	}

	const offeringData: TOfferingCreation = {
		name: fields.name[0],
		activity: fields.activity[0],
		start: new Date(fields.start[0]),
		end: new Date(fields.end[0]),
		duration: +fields.duration[0],
		description: fields.description[0],
		spots: +fields.spots[0],
		is_private: fields.is_private[0] === 'true',
		types: fields.types[0].split(','),
		categories: fields.categories[0].split(','),
		location: [fields.location[0]],
		timezone: fields.timezone[0],

		// owner
		studioId: fields.studioId[0],
	}

	const offering = await createOffering(offeringData)

	const filePromises = Object.keys(files).map(async (key) => {
		const file = files[key][0]

		const cloudinaryResource = await uploadToCloudinary(file.filepath)

		return createMediaFile({
			url: cloudinaryResource.secure_url,
			providerPublicId: cloudinaryResource.public_id,
			logoOfferingId: key === 'logo' ? offering.id : null,
			bannerOfferingId: key === 'banner' ? offering.id : null,
		})
	})

	await Promise.all(filePromises)

	return {
		data: offering,
		status: 'Success!',
	}
})