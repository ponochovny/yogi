import type { Prisma } from '@prisma/client'
import type { DefaultArgs } from '@prisma/client/runtime/library'
import { prisma } from '~/server/domains/shared'
import type { ICreatePurchaseData } from '~/server/types/purchase'

export const PurchaseRepo = {
	create: (data: ICreatePurchaseData) => {
		return prisma.purchase.create({
			data: {
				userId: data.user_id,
				ticketId: data.ticket_id,
				paymentId: data.id,
				receiptEmail: data.receipt_email,
				userName: data.user_name ? data.user_name : undefined,
			},
		})
	},

	findByPaymentId: (params: Prisma.PurchaseFindUniqueArgs<DefaultArgs>) => {
		return prisma.purchase.findUnique(params)
	},
}
