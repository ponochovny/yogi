import crypto from 'node:crypto'
import type { Prisma } from '@prisma/client'
import type { DefaultArgs } from '@prisma/client/runtime/library'
import { prisma } from '~/server/domains/shared'
import type { ICreatePurchaseData } from '~/server/types/purchase'

export const PurchaseRepo = {
	create: (data: ICreatePurchaseData) => {
		const qrSecret = crypto.randomBytes(16).toString('hex')
		return prisma.purchase.create({
			data: {
				userId: data.user_id,
				ticketId: data.ticket_id,
				paymentId: data.id,
				receiptEmail: data.receipt_email,
				userName: data.user_name ? data.user_name : undefined,
				qrSecret,
				status: 'PAID',
			},
			include: {
				ticket: {
					include: {
						offering: true,
					},
				},
			},
		})
	},

	findByPaymentId: (params: Prisma.PurchaseFindUniqueArgs<DefaultArgs>) => {
		return prisma.purchase.findUnique(params)
	},

	findById: (id: string) => {
		return prisma.purchase.findUnique({
			where: { id },
			include: {
				ticket: {
					include: {
						offering: {
							include: {
								banners: true,
								studio: true,
							},
						},
					},
				},
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						profileImage: true,
					},
				},
				attendances: {
					orderBy: {
						checkedInAt: 'desc',
					},
				},
			},
		})
	},

	findByUserId: (userId: string) => {
		return prisma.purchase.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
			include: {
				ticket: {
					include: {
						offering: {
							include: {
								banners: true,
								studio: true,
							},
						},
					},
				},
				attendances: true,
			},
		})
	},

	/**
	 * Preload attendee roster manifest for offline check-in caching
	 */
	findRosterByOfferingId: (offeringId: string) => {
		return prisma.purchase.findMany({
			where: {
				ticket: {
					offeringId,
				},
				status: 'PAID',
			},
			select: {
				id: true,
				ticketId: true,
				userName: true,
				receiptEmail: true,
				qrSecret: true,
				status: true,
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						profileImage: true,
					},
				},
				ticket: {
					select: {
						id: true,
						name: true,
					},
				},
				attendances: {
					where: {
						offeringId,
						status: 'CHECKED_IN',
					},
					select: {
						id: true,
						checkedInAt: true,
						status: true,
						sessionDate: true,
					},
				},
			},
		})
	},
}
