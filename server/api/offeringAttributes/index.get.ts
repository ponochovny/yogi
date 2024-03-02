import {
	getOfferingCategories,
	getOfferingTypes,
} from '~/server/db/offeringAttributes'

export default defineEventHandler(async () => {
	const categories = await getOfferingCategories()
	const types = await getOfferingTypes()

	return {
		categories,
		types,
	}
})
