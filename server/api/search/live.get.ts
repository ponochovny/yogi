import { OfferingRepo } from '~/server/domains/offering'

export default defineEventHandler(async () => {
	try {
		const count = await OfferingRepo.countLive()

		return {
			data: count,
			status: 'Success!',
		}
	} catch (error) {
		throw createError({ statusCode: 500 })
	}
})
