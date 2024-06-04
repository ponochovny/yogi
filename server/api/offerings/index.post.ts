import { convertPriceStringToNumber } from '~/helpers'
import type { IOfferingCreateData } from '~/helpers/types/offering'
import { generateSlug } from '~/lib/utils'
import { createMediaFile } from '~/server/db/mediaFiles'
import { createOffering } from '~/server/db/offerings'
import { attachPractitionerToOffering } from '~/server/db/practitioners'
import { createTicket } from '~/server/db/tickets'
import { extractForm } from '~/server/helpers'
import { uploadToCloudinary } from '~/server/utils/cloudinary'

export default defineEventHandler(async (event) => {
	const { fields, files } = await extractForm<
		Promise<{
			fields: { [key: string]: string[] } & { studioId: string }
			files: any
		}>
	>(event)

	const studioId = fields.studioId[0]

	const offeringData: Omit<
		IOfferingCreateData,
		| 'practitioners'
		| 'banners'
		| 'tickets'
		| 'location'
		| 'bannersDelete'
		| 'bannersOrder'
	> & { location: string } = {
		name: fields.name[0],
		slug: generateSlug(fields.name[0]),
		activity: fields.activity[0],
		start: new Date(fields.start[0]),
		end: new Date(fields.end[0]),
		duration: +fields.duration[0],
		description: fields.description[0],
		spots: +fields.spots[0],
		is_private: fields.is_private[0] === 'true',
		types: fields.types[0].split(','),
		categories: fields.categories[0].split(','),
		location: fields.location[0],
		timezone: fields.timezone[0],
		isActive: false,

		// owner
		studioId,
	}

	const offering = await createOffering(offeringData)

	// Practitioners
	if (fields[`practitioners[]`]) {
		const practitionerPromises = fields[`practitioners[]`].map(
			async (userId: string) => {
				return attachPractitionerToOffering({
					userId,
					offeringId: offering.id,
				})
			}
		)

		await Promise.all(practitionerPromises)
	}

	// Media files (Banner)
	if (files[`fileToUpload[]`]) {
		const filesArr = Object.keys(files[`fileToUpload[]`])
		const filePromises = filesArr.map(async (key, idx) => {
			const file = files[`fileToUpload[]`][key]

			const cloudinaryResource = await uploadToCloudinary(file.filepath)

			return createMediaFile({
				url: cloudinaryResource.secure_url,
				providerPublicId: cloudinaryResource.public_id,
				bannerOfferingId: offering.id,
				order: idx,
			})
		})

		await Promise.all(filePromises)
	}

	// Tickets
	const ticketPromises = []
	for (const ticket of fields['tickets[]']) {
		const _ticket = JSON.parse(ticket)

		ticketPromises.push(
			createTicket({
				name: _ticket.name as string,
				description: _ticket.description as string,
				price: convertPriceStringToNumber(_ticket.price),
				currency: _ticket.currency as string,
				offeringId: offering.id,
				status: 'active', // TODO: ticket status
			})
		)
	}
	await Promise.all(ticketPromises)

	return {
		data: offering,
		status: 'Success!',
	}
})
