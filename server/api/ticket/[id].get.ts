import { TicketRepo, toTicketDto } from '~/server/domains/offering'
import type { ITicketResponse } from '~/server/types/ticket'

export default defineEventHandler(async (event) => {
	const { id } = getRouterParams(event)
	if (!id) {
		throw createError({ statusCode: 400, statusMessage: 'Id is required' })
	}

	const ticket = (await TicketRepo.findById(id, {
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
		throw createError({
			statusCode: 400,
			statusMessage: 'Id is incorrect',
		})
	}

	return {
		data: toTicketDto(ticket),
		status: 'Success!',
	}
})
