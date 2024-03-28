import { stripe } from '~/server/utils/stripe'

interface IBody {
	amount: number
	currency: string
	ticket_id: string
	user_id: string | null
	user_name: string | null
}

export default defineEventHandler(async (event) => {
	const body: IBody = await readBody(event)
	const { amount, currency, ticket_id, user_id, user_name } = body

	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency,
			metadata: {
				ticket_id,
				user_id,
				user_name,
			},
			automatic_payment_methods: {
				enabled: true,
			},
		})

		return { secret: paymentIntent.client_secret }
	} catch (error) {
		throw createError({
			status: 500,
			statusMessage: (error as Error).message,
		})
	}
})
