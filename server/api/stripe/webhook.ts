import { PaymentService } from '~/server/domains/booking'

export default defineEventHandler(async (event) => {
	const headers = event.node.req.headers
	const body = await readRawBody(event)
	const signature = headers['stripe-signature']
	const ENDPOINT_SECRET = process.env.ENDPOINT_SECRET

	return PaymentService.handleWebhookEvent(
		body as string,
		signature as string,
		ENDPOINT_SECRET as string
	)
})
