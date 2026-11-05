import { generateSlug } from '~/src/shared/lib/utils'
import { uploadToCloudinary } from '~/server/domains/shared'
import { OfferingRepo } from '../repositories/offering.repo'
import { PractitionerRepo } from '../repositories/practitioner.repo'
import { TicketRepo } from '../repositories/ticket.repo'
import { MediaFileRepo } from '~/server/domains/user'

export const OfferingService = {
	createOffering: async (
		offeringData: {
			name: string
			description: string
			activity: any
			types: string[]
			categories: string[]
			duration: number
			spots: number
			location: string
			timezone: string
			start: Date
			end: Date
			is_private: boolean
			studioId: string
		},
		options: {
			tickets: Array<{
				name: string
				description: string
				price: number
				currency: string
				status: 'active' | 'inactive'
			}>
			practitioners: string[]
			banners: Array<{ filepath: string }>
		}
	) => {
		const offering = await OfferingRepo.create({
			...offeringData,
			slug: generateSlug(offeringData.name),
			isActive: false,
		})

		const practitionerPromises = options.practitioners.map((userId: string) =>
			PractitionerRepo.attachToOffering({ userId, offeringId: offering.id })
		)

		const filePromises = options.banners.map(async (file: { filepath: string }, idx: number) => {
			const cloudinaryResource = await uploadToCloudinary(file.filepath)
			return MediaFileRepo.create({
				url: cloudinaryResource.secure_url,
				providerPublicId: cloudinaryResource.public_id,
				bannerOfferingId: offering.id,
				order: idx,
			})
		})

		const ticketPromises = options.tickets.map((ticket) =>
			TicketRepo.create({
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

		return { data: offering, status: 'Success!', ...(errors.length && { errors }) }
	},
}

