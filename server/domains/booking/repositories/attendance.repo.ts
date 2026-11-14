import { prisma } from '~/server/domains/shared'

export interface IRecordCheckInData {
	purchaseId: string
	offeringId: string
	scannedByUserId?: string | null
	checkInMethod?: string
	deviceId?: string | null
	clientScanTime?: Date | null
	sessionDate?: string | null
	notes?: string | null
}

export const AttendanceRepo = {
	recordCheckIn: (data: IRecordCheckInData) => {
		return prisma.attendance.create({
			data: {
				purchaseId: data.purchaseId,
				offeringId: data.offeringId,
				scannedByUserId: data.scannedByUserId || undefined,
				checkInMethod: data.checkInMethod || 'QR_SCAN',
				deviceId: data.deviceId || undefined,
				clientScanTime: data.clientScanTime || undefined,
				syncedAt: new Date(),
				sessionDate: data.sessionDate || undefined,
				notes: data.notes || undefined,
				status: 'CHECKED_IN',
			},
			include: {
				purchase: {
					include: {
						ticket: true,
						user: true,
					},
				},
			},
		})
	},

	findExistingCheckIn: (purchaseId: string, offeringId: string, sessionDate?: string | null) => {
		return prisma.attendance.findFirst({
			where: {
				purchaseId,
				offeringId,
				status: 'CHECKED_IN',
				...(sessionDate ? { sessionDate } : {}),
			},
		})
	},

	findByOfferingId: (offeringId: string) => {
		return prisma.attendance.findMany({
			where: {
				offeringId,
			},
			orderBy: {
				checkedInAt: 'desc',
			},
			include: {
				purchase: {
					select: {
						id: true,
						userName: true,
						receiptEmail: true,
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
					},
				},
			},
		})
	},

	/**
	 * Process offline sync batch idempotently
	 */
	batchSync: async (
		records: Array<IRecordCheckInData & { id?: string }>,
		syncedByUserId?: string
	) => {
		const results: Array<{ purchaseId: string; status: 'SUCCESS' | 'DUPLICATE' | 'FAILED'; error?: string }> = []

		for (const record of records) {
			try {
				const existing = await prisma.attendance.findFirst({
					where: {
						purchaseId: record.purchaseId,
						offeringId: record.offeringId,
						status: 'CHECKED_IN',
						...(record.sessionDate ? { sessionDate: record.sessionDate } : {}),
					},
				})

				if (existing) {
					results.push({
						purchaseId: record.purchaseId,
						status: 'DUPLICATE',
						error: 'Already checked in',
					})
					continue
				}

				await prisma.attendance.create({
					data: {
						purchaseId: record.purchaseId,
						offeringId: record.offeringId,
						scannedByUserId: syncedByUserId || record.scannedByUserId || undefined,
						checkInMethod: 'OFFLINE_SYNC',
						deviceId: record.deviceId || undefined,
						clientScanTime: record.clientScanTime ? new Date(record.clientScanTime) : undefined,
						syncedAt: new Date(),
						sessionDate: record.sessionDate || undefined,
						status: 'CHECKED_IN',
					},
				})

				results.push({
					purchaseId: record.purchaseId,
					status: 'SUCCESS',
				})
			} catch (err: any) {
				results.push({
					purchaseId: record.purchaseId,
					status: 'FAILED',
					error: err?.message || 'Database error',
				})
			}
		}

		return results
	},
}

