import type { IPurchaseResponse, TPurchase } from '~/src/app/types/purchase'
import { ticketTransformer } from './ticket'

export const purchaseTransformer = (data: IPurchaseResponse): TPurchase => {
	const { ticketId, userId, userName, ...rest } = data
	return {
		...rest,
		ticket: data.ticket ? ticketTransformer(data.ticket) : undefined,
	}
}
