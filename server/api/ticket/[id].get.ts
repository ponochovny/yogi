import { getTicketById } from '~/server/db/tickets'
import { ticketTransformer } from '~/server/transformers/ticket'
import type { ITicketResponse } from '~/server/types/ticket'

export default defineEventHandler(async (event) => {
	const { id } = getRouterParams(event)

	const ticket = (await getTicketById(id, {
		include: {
			offering: {
				include: {
					banners: true,
				},
			},
		},
		where: { id },
	})) as unknown as ITicketResponse

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
