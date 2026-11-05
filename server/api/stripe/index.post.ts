import { PaymentService } from '~/server/domains/booking'

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
		return await PaymentService.createPaymentIntent({
			amount,
			currency,
			ticket_id,
			user_id,
			user_name,
		})
	} catch (error) {
		throw createError({
			status: 500,
			statusMessage: (error as Error).message,
		})
	}
})
