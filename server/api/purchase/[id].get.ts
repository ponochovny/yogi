import { getPurchaseByPaymentId } from '~/server/db/purchase'
import { purchaseTransformer } from '~/server/transformers/purchase'

export default defineEventHandler(async (event) => {
	const { id } = getRouterParams(event)

	const purchase = await getPurchaseByPaymentId({
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
	})

	if (!purchase) {
		return sendError(
			event,
			createError({
				statusCode: 400,
				statusMessage: 'Id is incorrect',
			})
		)
	}

	return {
		data: purchaseTransformer(purchase),
		status: 'Success!',
	}
})
