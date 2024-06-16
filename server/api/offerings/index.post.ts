import { offeringDataCreationSchema } from '~/helpers/types/offering'
import { generateSlug } from '~/lib/utils'
import { createMediaFile } from '~/server/db/mediaFiles'
import { createOffering } from '~/server/db/offerings'
import { attachPractitionerToOffering } from '~/server/db/practitioners'
import { createTicket } from '~/server/db/tickets'
import { extractForm } from '~/server/helpers'
import { uploadToCloudinary } from '~/server/utils/cloudinary'

const parseArrayField = (fields: { [key: string]: string }, field: string) => {
	const fieldKey = field + '[]'
	const isSingleTicket = typeof fields[fieldKey] === 'string'

	let result
	try {
		result = JSON.parse(fields[fieldKey])
	} catch (e) {
		result = fields[fieldKey]
	}
	if (isSingleTicket) return [result]

	return (fields[fieldKey] as unknown as string[])?.map((ticket) => {
		try {
			return JSON.parse(ticket)
		} catch (e) {
			return ticket
		}
	})
}

export default defineEventHandler(async (event) => {
	const { fields, files } = await extractForm<
		Promise<{
			fields: { [key: string]: string } & { studioId: string }
			files: any
		}>
	>(event)

	const studioId = fields.studioId

	const offeringData = {
		name: fields.name,
		description: fields.description,
		activity: fields.activity,
		slug: generateSlug(fields.name),
		types: fields.types.split(','),
		categories: fields.categories.split(','),
		duration: +fields.duration,
		spots: +fields.spots,
		location: JSON.parse(fields.location as unknown as string),
		timezone: fields.timezone,
		start: new Date(fields.start),
		end: new Date(fields.end),
		is_private: fields.is_private === 'true',
		isActive: false,
		tickets: parseArrayField(fields, 'tickets'),
		practitioners: parseArrayField(fields, 'practitioners'),
		banners: files[`fileToUpload[]`] || [],
		// bannersDelete: z.array(z.string()).optional(),
		// bannersOrder: z.array(z.string()).optional(),

		// Owner
		studioId,
	}

	// CHECK DATA (PARSE BY SCHEMA)
	const parsed = offeringDataCreationSchema.safeParse(offeringData)
	if (!parsed.success) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Data is not valid',
		})
	}

	const { banners, practitioners, tickets, location, ...restOfferingData } =
		offeringData

	// Offering
	const offering = await createOffering({
		...restOfferingData,
		location: JSON.stringify(location),
	})

	// Practitioners
	const practitionerPromises = offeringData.practitioners.map(
		async (userId: string) => {
			return attachPractitionerToOffering({
				userId,
				offeringId: offering.id,
			})
		}
	)
	// Media files (Banners)
	const filePromises = (offeringData.banners as any[]).map(
		async (file: any, idx) => {
			const cloudinaryResource = await uploadToCloudinary(file.filepath)

			return createMediaFile({
				url: cloudinaryResource.secure_url,
				providerPublicId: cloudinaryResource.public_id,
				bannerOfferingId: offering.id,
				order: idx,
			})
		}
	)
	// Tickets
	const ticketPromises = offeringData.tickets.map((ticket) =>
		createTicket({
			name: ticket.name,
			description: ticket.description,
			price: ticket.price * 100,
			currency: ticket.currency,
			offeringId: offering.id,
			status: ticket.status,
		})
	)
	const results = await Promise.allSettled([
		...practitionerPromises,
		...filePromises,
		...ticketPromises,
	])
	const errors: string[] = []
	results.forEach((result, index) => {
		if (result.status === 'rejected') {
			errors.push(`Promise ${index} rejected with reason: ${result.reason}`)
		}
	})

	return {
		data: offering,
		status: 'Success!',
		...(errors.length && { errors }),
	}
})
