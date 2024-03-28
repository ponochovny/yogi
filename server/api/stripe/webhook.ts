import type Stripe from 'stripe'
import { createPurchase } from '~/server/db/purchase'
import { stripe } from '~/server/utils/stripe'

export default defineEventHandler(async (event) => {
	const headers = event.node.req.headers

	const body = await readRawBody(event)
	const signature = headers['stripe-signature']
	let hookEvent: Stripe.Event

	const ENDPOINT_SECRET = process.env.ENDPOINT_SECRET

	try {
		hookEvent = stripe.webhooks.constructEvent(
			body as string,
			signature as string,
			ENDPOINT_SECRET as string
		)
	} catch (error: any) {
		throw createError({
			statusCode: 400,
			message: `Webhook error : ${error.message}`,
		})
	}

	switch (hookEvent.type) {
		case 'payment_intent.created':
			console.log('payment_intent.created')
			break
		case 'payment_intent.succeeded':
			const intendSucceeded = hookEvent.data.object
			await createPurchase({
				id: intendSucceeded.id,
				receipt_email: intendSucceeded.receipt_email || '',
				user_id: intendSucceeded.metadata.user_id,
				user_name: intendSucceeded.metadata.user_name,
				ticket_id: intendSucceeded.metadata.ticket_id,
			})
			break
		case 'charge.succeeded':
			// const chargeSucceeded = hookEvent.data.object as Stripe.Charge
			// console.log('charge.succeeded', chargeSucceeded.metadata.userId)
			// console.log('charge.succeeded', chargeSucceeded.receipt_url)
			break
		default:
			console.log(`Unhandled event type ${hookEvent.type}`)
	}

	return {
		data: null,
		status: 200,
	}
})
