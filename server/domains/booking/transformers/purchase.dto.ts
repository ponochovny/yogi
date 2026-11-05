import type { IPurchaseResponse, TPurchase } from '~/src/app/types/purchase'
import { toTicketDto } from '~/server/domains/offering'

export const toPurchaseDto = (data: IPurchaseResponse): TPurchase => {
	const { ticketId, userId, userName, ...rest } = data
	return {
		...rest,
		ticket: data.ticket ? toTicketDto(data.ticket) : undefined,
	}
}
