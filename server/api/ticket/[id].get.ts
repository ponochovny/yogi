import { getTicketById } from '~/server/db/tickets'
import { ticketTransformer } from '~/server/transformers/ticket'

export default defineEventHandler(async (event) => {
	const { id } = getRouterParams(event)

	const ticket = await getTicketById(id, {
		include: {
			offering: {
				include: {
					banners: true,
				},
			},
		},
		where: { id },
	})

	if (!ticket) {
		return sendError(
			event,
			createError({
				statusCode: 400,
				statusMessage: 'Id is incorrect',
			})
		)
	}

	return {
		data: ticketTransformer(ticket),
		status: 'Success!',
	}
})
