import type { IUser } from '~/server/types'
import type { ITicket } from './offering'

export interface IPurchase {
	id: string
	paymentId: string
	receiptEmail: string
	ticket?: ITicket
	ticketId: string
	userId: string | null
	user?: IUser
	userName: string | null
}
