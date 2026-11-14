import { z } from 'zod'
import { AttendanceService } from '~/server/domains/booking'

const scanBodySchema = z.object({
	rawScannedText: z.string().min(1, 'rawScannedText is required'),
	offeringId: z.string().min(1, 'offeringId is required'),
	deviceId: z.string().optional(),
	sessionDate: z.string().optional(),
})

export default defineEventHandler(async (event) => {
	const session = await requireUserSession(event)
	const body = await readBody(event)

	const validation = scanBodySchema.safeParse(body)
	if (!validation.success) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid scan payload',
			data: validation.error.format(),
		})
	}

	const result = await AttendanceService.processLiveScan({
		rawScannedText: validation.data.rawScannedText,
		offeringId: validation.data.offeringId,
		scannedByUserId: session.user.id,
		deviceId: validation.data.deviceId,
		sessionDate: validation.data.sessionDate,
	})

	return {
		success: true,
		data: result,
	}
})

