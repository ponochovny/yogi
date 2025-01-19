import { getOfferingsLiveCount } from '~/server/db/offerings'

export default defineEventHandler(async () => {
	try {
		const count = await getOfferingsLiveCount()

		return {
			data: count,
			status: 'Success!',
		}
	} catch (error) {
		throw createError({ status: 500 })
	}
})
