import type { Prisma } from '@prisma/client'
import type { DefaultArgs } from '@prisma/client/runtime/library'
import { prisma } from '.'

export const createTicket = (data: {
	name: string
	description: string
	price: number
	currency: string
	offeringId: string
	status: 'active' | 'inactive'
}) =>
	prisma.ticket.create({
		data: {
			name: data.name,
			description: data.description,
			price: data.price,
			currency: data.currency,
			offeringId: data.offeringId,
			status: data.status,
		},
	})

export const updateTicket = (
	data: Partial<{
		name: string
		description: string
		price: number
		currency: string
		offeringId: string
		status: 'active' | 'inactive'
	}>,
	ticketId: string
) =>
	prisma.ticket.update({
		where: {
			id: ticketId,
		},
		data,
	})

export const getTicketById = (
	id: string,
	params: Prisma.TicketFindUniqueArgs<DefaultArgs> = { where: { id } }
) =>
	prisma.ticket.findUnique({
		...params,
		where: { ...params.where, id },
	})
