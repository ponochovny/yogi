import type { DefaultArgs } from '@prisma/client/runtime/library'
import { prisma } from '.'
import type { Prisma } from '@prisma/client'
import type { ICreatePurchaseData } from '../types/purchase'

export const createPurchase = (data: ICreatePurchaseData) =>
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
