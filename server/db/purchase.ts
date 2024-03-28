import type { DefaultArgs } from '@prisma/client/runtime/library'
import { prisma } from '.'
import type { Prisma } from '@prisma/client'

export const createPurchase = (data: {
	id: string
	receipt_email: string
	user_id: string
	user_name: string | null
	ticket_id: string
}) =>
	prisma.purchase.create({
		data: {
			userId: data.user_id,
			ticketId: data.ticket_id,
			paymentId: data.id,
			receiptEmail: data.receipt_email,
			userName: data.user_name ? data.user_name : undefined,
		},
	})

export const getPurchaseByPaymentId = (
	params: Prisma.PurchaseFindUniqueArgs<DefaultArgs>
) => prisma.purchase.findUnique(params)
