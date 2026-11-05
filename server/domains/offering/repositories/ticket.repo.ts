import type { Prisma } from '@prisma/client'
import type { DefaultArgs } from '@prisma/client/runtime/library'
import { prisma } from '~/server/domains/shared'
import type { ICreateTicketData, TUpdateTicketData } from '~/server/types/ticket'

export const TicketRepo = {
	create: ({ name, description, price, currency, offeringId, status }: ICreateTicketData) => {
		return prisma.ticket.create({ data: { name, description, price, currency, offeringId, status } })
	},

	update: (data: TUpdateTicketData, ticketId: string) => {
		return prisma.ticket.update({ where: { id: ticketId }, data })
	},

	findById: (id: string, params: Prisma.TicketFindUniqueArgs<DefaultArgs> = { where: { id } }) => {
		return prisma.ticket.findUnique({ ...params, where: { ...params.where, id } })
	},
}
