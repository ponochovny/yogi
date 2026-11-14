import { z } from 'zod'
import { AttendanceService } from '~/server/domains/booking'

const syncBatchSchema = z.object({
	offeringId: z.string().min(1, 'offeringId is required'),
	items: z.array(
		z.object({
			purchaseId: z.string().min(1),
			offeringId: z.string().min(1),
			clientScanTime: z.string().datetime().optional().nullable(),
			deviceId: z.string().optional().nullable(),
			sessionDate: z.string().optional().nullable(),
			checkInMethod: z.string().optional(),
		})
	),
})

export default defineEventHandler(async (event) => {
	const session = await requireUserSession(event)
	const body = await readBody(event)

	const validation = syncBatchSchema.safeParse(body)
	if (!validation.success) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid sync payload',
			data: validation.error.format(),
		})
	}

	const formattedItems = validation.data.items.map((item) => ({
		purchaseId: item.purchaseId,
		offeringId: item.offeringId,
		clientScanTime: item.clientScanTime ? new Date(item.clientScanTime) : undefined,
		deviceId: item.deviceId || undefined,
		sessionDate: item.sessionDate || undefined,
		checkInMethod: item.checkInMethod || 'OFFLINE_SYNC',
	}))

	const result = await AttendanceService.processOfflineSyncBatch({
		offeringId: validation.data.offeringId,
		syncedByUserId: session.user.id,
		items: formattedItems,
	})

	return {
		success: true,
		data: result,
	}
})

