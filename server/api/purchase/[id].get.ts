import { PurchaseRepo, toPurchaseDto } from '~/server/domains/booking'
import type { IPurchaseResponse } from '~/src/app/types/purchase'

export default defineEventHandler(async (event) => {
	const { id } = getRouterParams(event)

	const purchase = (await PurchaseRepo.findByPaymentId({
		include: {
			ticket: {
				include: {
					offering: {
						include: {
							banners: true,
						},
					},
				},
			},
		},
		where: { paymentId: id },
	})) as unknown as IPurchaseResponse

	if (!purchase) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Id is incorrect',
		})
	}

	return {
		data: toPurchaseDto(purchase),
		status: 'Success!',
	}
})
