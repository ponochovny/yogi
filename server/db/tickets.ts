import type { Prisma } from '@prisma/client'
import type { DefaultArgs } from '@prisma/client/runtime/library'
import { prisma } from '.'
import type { ICreateTicketData, TUpdateTicketData } from '../types/ticket'

export const createTicket = ({
	name,
	description,
	price,
	currency,
	offeringId,
	status,
}: ICreateTicketData) =>
	prisma.ticket.create({
		data: {
			name,
			description,
			price,
			currency,
			offeringId,
			status,
		},
	})

export const updateTicket = (data: TUpdateTicketData, ticketId: string) =>
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
