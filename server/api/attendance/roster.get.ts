import { z } from 'zod'
import { AttendanceService } from '~/server/domains/booking'

const querySchema = z.object({
	offeringId: z.string().min(1, 'offeringId is required'),
})

export default defineEventHandler(async (event) => {
	const session = await requireUserSession(event)
	const query = getQuery(event)

	const validation = querySchema.safeParse(query)
	if (!validation.success) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid query parameters',
			data: validation.error.format(),
		})
	}

	const roster = await AttendanceService.getOfflineRosterManifest(
		validation.data.offeringId,
		session.user.id
	)

	return {
		success: true,
		data: roster,
	}
})

