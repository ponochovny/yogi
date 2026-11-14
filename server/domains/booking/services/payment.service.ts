import { stripe } from '~/server/domains/shared'
import { PurchaseRepo } from '../repositories/purchase.repo'
import { notFound } from '~/server/domains/shared'
import type { ICreatePurchaseData } from '~/server/types/purchase'

export interface ICreatePaymentIntentInput {
	amount: number
	currency: string
	ticket_id: string
	user_id: string | null
	user_name: string | null
}

export const PaymentService = {
	createPaymentIntent: async ({ amount, currency, ticket_id, user_id, user_name }: ICreatePaymentIntentInput) => {
		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency,
			metadata: {
				ticket_id,
				user_id: user_id ?? '',
				user_name: user_name ?? '',
			},
			automatic_payment_methods: { enabled: true },
		})

		return { secret: paymentIntent.client_secret }
	},

	handleWebhookEvent: async (body: string, signature: string, endpointSecret: string) => {
		let hookEvent
		try {
			hookEvent = stripe.webhooks.constructEvent(body, signature, endpointSecret)
		} catch (error: any) {
			throw createError({
				statusCode: 400,
				message: `Webhook error: ${error.message}`,
			})
		}

		switch (hookEvent.type) {
			case 'payment_intent.created':
				break
			case 'payment_intent.succeeded': {
				const intendSucceeded = hookEvent.data.object
				const { user_id, user_name, ticket_id } = intendSucceeded.metadata
				if (!user_id || !user_name || !ticket_id) {
					throw createError({
						statusCode: 400,
						statusMessage: 'Payment intent metadata is incomplete',
					})
				}
				const purchaseData: ICreatePurchaseData = {
					id: intendSucceeded.id,
					receipt_email: intendSucceeded.receipt_email || '',
					user_id,
					user_name,
					ticket_id,
				}
				await PurchaseRepo.create(purchaseData)
				break
			}
			case 'charge.succeeded':
				break
			default:
				console.log(`Unhandled event type ${hookEvent.type}`)
		}

		return { data: null, status: 200 }
	},
}
