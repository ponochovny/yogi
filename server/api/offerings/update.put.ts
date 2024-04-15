import formidable from 'formidable'
import { convertPriceStringToNumber } from '~/helpers'
import type {
	IOfferingCreation,
	IOfferingUpdate,
} from '~/helpers/types/offering'
import { generateSlug } from '~/lib/utils'
import { createMediaFile } from '~/server/db/mediaFiles'
import { updateOffering } from '~/server/db/offerings'
import { removePractitioner } from '~/server/db/practitioners'
import { attachPractitionerToOffering } from '~/server/db/practitioners'
import { createTicket, updateTicket } from '~/server/db/tickets'

interface IOfferingUpdateForm extends IOfferingUpdate {
	'practitioners[]': string[]
	'practitionersRemove[]': string[]
	'tickets[]': string[]
	'ticketsRemove[]': string[]
}

export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const offeringId = query.id

	if (!offeringId || typeof offeringId !== 'string') {
		throw createError({ status: 401, message: 'No id provided' })
	}

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
		fields: { [key in keyof IOfferingUpdateForm]: string[] } & {
			studioId: string
		}
		files: any
	}

	const offeringData: Partial<
		Omit<
			IOfferingCreation,
			'practitioners' | 'banners' | 'tickets' | 'location'
		>
	> & { location: string } = {
		...(fields.name[0] && { name: fields.name[0] }),
		...(fields.name[0] && { slug: generateSlug(fields.name[0]) }),
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
	}

	const updatedOffering = await updateOffering(offeringData, offeringId)

	// Handle Remove Practitioners
	if (fields[`practitionersRemove[]`]) {
		const practitionersRemovePromises = fields[`practitionersRemove[]`].map(
			async (userId: string) => {
				return removePractitioner({
					where: {
						userId,
						offeringId: offeringId.toString(),
					},
				})
			}
		)

		await Promise.all(practitionersRemovePromises)
	}

	// Handle Remove Tickets
	if (fields[`ticketsRemove[]`]) {
		const ticketsRemovePromises = []
		for (const ticketId of fields['ticketsRemove[]']) {
			ticketsRemovePromises.push(
				updateTicket(
					{
						status: 'inactive',
					},
					ticketId
				)
			)
		}
		await Promise.all(ticketsRemovePromises)
	}

	// Practitioners
	if (fields[`practitioners[]`]) {
		const practitionerPromises = fields[`practitioners[]`].map(
			async (userId: string) => {
				return attachPractitionerToOffering({
					userId,
					offeringId,
				})
			}
		)

		await Promise.all(practitionerPromises)
	}

	// Media files (Banner)
	if (files[`fileToUpload[]`]) {
		const filePromises = Object.keys(files[`fileToUpload[]`]).map(
			async (key) => {
				const file = files[`fileToUpload[]`][key]

				const cloudinaryResource = await uploadToCloudinary(file.filepath)

				return createMediaFile({
					url: cloudinaryResource.secure_url,
					providerPublicId: cloudinaryResource.public_id,
					bannerOfferingId: offeringId,
				})
			}
		)

		await Promise.all(filePromises)
	}

	// Tickets
	if (fields['tickets[]'] && typeof fields['tickets[]'] === 'string') {
		const ticketPromises = []
		for (const ticket of JSON.parse(fields['tickets[]'])) {
			const _ticket = JSON.parse(ticket)

			ticketPromises.push(
				createTicket({
					name: _ticket.name as string,
					description: _ticket.description as string,
					price: convertPriceStringToNumber(_ticket.price),
					currency: _ticket.currency as string,
					offeringId,
					status: 'active', // TODO: ticket status
				})
			)
		}
		await Promise.all(ticketPromises)
	}

	return {
		data: updatedOffering,
		status: 'Success!',
	}
})
