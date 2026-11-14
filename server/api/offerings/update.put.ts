import { convertPriceStringToNumber } from '~/src/shared/helpers'
import type { EActivity, IOfferingCreateData } from '~/src/app/types/offering'
import { generateSlug } from '~/src/shared/lib/utils'
import { OfferingRepo, PractitionerRepo, TicketRepo } from '~/server/domains/offering'
import { MediaFileRepo } from '~/server/domains/user'
import { extractForm, uploadToCloudinary } from '~/server/domains/shared'

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
		throw createError({ statusCode: 401, statusMessage: 'No id provided' })
	}

	const { fields, files } = await extractForm<{
		fields: { [key: string]: string }
		files: any
	}>(event)

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
				typeof fields.isActive === 'boolean'
					? !!fields.isActive
					: fields.isActive === 'true',
		}
	}

	const offeringData: IOfferingUpdateDataForm = fieldsFromForm()
	const updatedOffering = await OfferingRepo.update(offeringData, offeringId)

	// Handle Remove Practitioners
	if (fields[`practitionersRemove[]`]) {
		const practitionersRemovePromises = (
			fields[`practitionersRemove[]`] as unknown as string[]
		).map(async (userId: string) => {
			return PractitionerRepo.removeMany({
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
				TicketRepo.update({ status: 'inactive' }, ticketId)
			)
		}
		await Promise.all(ticketsRemovePromises)
	}

	// Practitioners
	if (fields[`practitioners[]`]) {
		const practitionerPromises = (
			fields[`practitioners[]`] as unknown as string[]
		).map(async (userId: string) => {
			return PractitionerRepo.attachToOffering({
				userId,
				offeringId,
			})
		})

		await Promise.all(practitionerPromises)
	}

	// Media files (Banner)
	const findNthNullIndex = (arr: any[], n: number) => {
		let nullCount = 0
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] === null) {
				nullCount++
				if (nullCount === n) {
					return i
				}
			}
		}
		return -1
	}

	if (fields.bannersOrder) {
		const bannersOrder = JSON.parse(fields.bannersOrder) as (string | null)[]
		const bannersDelete = JSON.parse(fields.bannersDelete || '[]') as string[]
		const orderArr = bannersOrder.map((el) =>
			el && bannersDelete.includes(el) ? null : el
		)
		const deleteMediaFilePromises = bannersDelete.map((el) =>
			MediaFileRepo.delete(el)
		)
		const updateMediaFileOrderPromises = orderArr.map((el, idx) => {
			if (el === null) return
			return MediaFileRepo.update(el as string, { order: idx })
		})
		await Promise.all([
			...updateMediaFileOrderPromises,
			...deleteMediaFilePromises,
		])
	}

	if (files[`fileToUpload[]`]) {
		const filesArr = Object.keys(files[`fileToUpload[]`])
		const orderArr = fields.bannersOrder
			? (JSON.parse(fields.bannersOrder) as (string | null)[])
			: []
		const setOrder = (idx: number) => {
			if (!fields.bannersOrder) return
			return findNthNullIndex(orderArr, idx + 1)
		}

		const filePromises = filesArr.map(async (key, idx) => {
			const order = setOrder(idx)
			const file = files[`fileToUpload[]`][key]

			const cloudinaryResource = await uploadToCloudinary(file.filepath)

			return MediaFileRepo.create({
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
		for (const ticket of fields['tickets[]'] ?? []) {
			const ticketData = JSON.parse(ticket)

			ticketPromises.push(
				TicketRepo.create({
					name: ticketData.name as string,
					description: ticketData.description as string,
					price: convertPriceStringToNumber(ticketData.price),
					currency: ticketData.currency as string,
					offeringId,
					status: 'active',
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
