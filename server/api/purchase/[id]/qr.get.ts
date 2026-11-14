import { PurchaseRepo, QrService, toPurchaseDto } from '~/server/domains/booking'
import type { IPurchaseResponse } from '~/src/app/types/purchase'

export default defineEventHandler(async (event) => {
	const { id } = getRouterParams(event)

	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Purchase ID is required',
		})
	}

	// Try find by Mongo ObjectId or by Stripe paymentId
	let purchase = await PurchaseRepo.findById(id)
	if (!purchase) {
		purchase = (await PurchaseRepo.findByPaymentId({
			where: { paymentId: id },
			include: {
				ticket: {
					include: {
						offering: {
							include: {
								banners: true,
								studio: true,
							},
						},
					},
				},
				attendances: true,
			},
		})) as any
	}

	if (!purchase || !purchase.ticket || !purchase.ticket.offering) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Purchase or associated ticket not found',
		})
	}

	const offering = purchase.ticket.offering
	const token = QrService.generateToken({
		purchaseId: purchase.id,
		offeringId: offering.id,
		ticketId: purchase.ticket.id,
		qrSecret: purchase.qrSecret,
	})

	const qrDataUrl = await QrService.generateDataUrl(token)

	const isCheckedIn = (purchase.attendances || []).some((a: any) => a.status === 'CHECKED_IN')

	return {
		success: true,
		data: {
			purchase: toPurchaseDto(purchase as unknown as IPurchaseResponse),
			token,
			qrDataUrl,
			isCheckedIn,
			status: purchase.status,
		},
	}
})

