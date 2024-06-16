import { convertPriceStringToNumber } from '~/helpers'
import type { EActivity, IOfferingCreateData } from '~/helpers/types/offering'
import { generateSlug } from '~/lib/utils'
import {
	createMediaFile,
	deleteMediaFile,
	updateMediaFile,
} from '~/server/db/mediaFiles'
import { updateOffering } from '~/server/db/offerings'
import { removePractitioner } from '~/server/db/practitioners'
import { attachPractitionerToOffering } from '~/server/db/practitioners'
import { createTicket, updateTicket } from '~/server/db/tickets'
import { extractForm } from '~/server/helpers'

type IOfferingUpdateDataForm = Partial<
	Omit<
		IOfferingCreateData,
		'practitioners' | 'banners' | 'tickets' | 'location'
	>
> & {
	location?: string
	practitionersRemove?: string[]
	ticketsRemove?: string[]
}

export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const offeringId = query.id

	if (!offeringId || typeof offeringId !== 'string') {
		throw createError({ status: 401, message: 'No id provided' })
	}

	const { fields, files } = await extractForm<
		Promise<{
			fields: { [key: string]: string } & { studioId: string }
			files: any
		}>
	>(event)

	const fieldsFromForm = () => {
		return {
			...(fields.name && { name: fields.name }),
			...(fields.name && { slug: generateSlug(fields.name) }),
			...(fields.activity && { activity: fields.activity as EActivity }),
			...(fields.start && { start: new Date(fields.start) }),
			...(fields.end && { end: new Date(fields.end) }),
			...(fields.duration && { duration: +fields.duration }),
			...(fields.description && { description: fields.description }),
			...(fields.spots && { spots: +fields.spots }),
			...(fields.is_private && {
				is_private: fields.is_private === 'true',
			}),
			...(fields.types && { types: fields.types.split(',') }),
			...(fields.categories && {
				categories: fields.categories.split(','),
			}),
			...(fields.location && { location: fields.location }),
			...(fields.timezone && { timezone: fields.timezone }),
			isActive:
				typeof fields.isActive == 'boolean'
					? !!fields.isActive
					: fields.isActive === 'true',
		}
	}

	const offeringData: IOfferingUpdateDataForm = fieldsFromForm()

	const updatedOffering = await updateOffering(offeringData, offeringId)

	// Handle Remove Practitioners
	if (fields[`practitionersRemove[]`]) {
		const practitionersRemovePromises = (
			fields[`practitionersRemove[]`] as unknown as string[]
		).map(async (userId: string) => {
			return removePractitioner({
				where: {
					userId,
					offeringId: offeringId.toString(),
				},
			})
		})

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
		const practitionerPromises = (
			fields[`practitioners[]`] as unknown as string[]
		).map(async (userId: string) => {
			return attachPractitionerToOffering({
				userId,
				offeringId,
			})
		})

		await Promise.all(practitionerPromises)
	}

	// Media files (Banner)

	const findNthNullIndex = (arr: any[], n: number) => {
		console.log('findNthNullIndex', arr, n)
		let nullCount = 0
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] === null) {
				nullCount++
				if (nullCount === n) {
					console.log('return', i)
					return i
				}
			}
		}
		return -1
	}
	if (fields.bannersOrder) {
		console.log('fields.bannersOrder', fields.bannersOrder)
		const bannersOrder = JSON.parse(fields.bannersOrder[0]) as (string | null)[]
		const bannersDelete = JSON.parse(fields.bannersDelete[0]) as string[]
		const orderArr = bannersOrder.map((el) =>
			el && bannersDelete.includes(el) ? null : el
		)
		const deleteMediaFilePromises = bannersDelete.map((el) =>
			deleteMediaFile(el)
		)
		const updateMediaFileOrderPromises = orderArr.map((el, idx) => {
			if (el === null) return
			return updateMediaFile(el as string, { order: idx })
		})
		await Promise.all([
			...updateMediaFileOrderPromises,
			...deleteMediaFilePromises,
		])
	}
	if (files[`fileToUpload[]`]) {
		const filesArr = Object.keys(files[`fileToUpload[]`])
		const orderArr = fields.bannersOrder
			? (JSON.parse(fields.bannersOrder[0]) as (string | null)[])
			: []
		const setOrder = (idx: number) => {
			if (!fields.bannersOrder) return
			return findNthNullIndex(orderArr, idx + 1)
		}

		const filePromises = filesArr.map(async (key, idx) => {
			const order = setOrder(idx)
			const file = files[`fileToUpload[]`][key]

			const cloudinaryResource = await uploadToCloudinary(file.filepath)

			return createMediaFile({
				url: cloudinaryResource.secure_url,
				providerPublicId: cloudinaryResource.public_id,
				bannerOfferingId: offeringId,
				order,
			})
		})

		await Promise.all(filePromises)
	}

	// Tickets
	if (fields['tickets[]']) {
		const ticketPromises = []
		for (const ticket of fields['tickets[]']) {
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
		files,
		filesArray: files[`fileToUpload[]`]
			? Object.keys(files[`fileToUpload[]`])
			: null,
		status: 'Success!',
	}
})
