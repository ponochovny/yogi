import type { TUser } from '~/server/types'
import type { TTicket } from './ticket'
import type { ITicketResponse } from '~/server/types/ticket'

export interface IPurchase {
	id: string
	paymentId: string
	receiptEmail: string
	ticket?: TTicket
	ticketId: string
	userId: string | null
	user?: TUser
	userName: string | null
}

export type TPurchase = Omit<
	IPurchaseResponse,
	'ticketId' | 'userId' | 'userName' | 'ticket'
> & { ticket?: TTicket }

export interface IPurchaseResponse {
	id: string
	paymentId: string
	receiptEmail: string
	ticket?: ITicketResponse
	ticketId: string
	userId: string | null
	user?: TUser
	userName: string | null
}
