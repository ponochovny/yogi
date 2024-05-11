import type { IOfferingResponse } from './offering'

export interface ITicketResponse {
	id: string
	name: string
	description: string
	price: number
	currency: string
	status: 'active' | 'inactive' | string
	// fee: number
	/**
	 * Mandatory 1-1 relation
	 */
	offering?: IOfferingResponse
	offeringId: string
	purchase?: any[]
}

export interface ICreateTicketData {
	name: string
	description: string
	price: number
	currency: string
	offeringId: string
	status: 'active' | 'inactive'
}

export type TUpdateTicketData = Partial<{
	name: string
	description: string
	price: number
	currency: string
	offeringId: string
	status: 'active' | 'inactive'
}>
