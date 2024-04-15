// const  TYPES = 'country,postcode,place,address'
// const TYPES = 'address'
const TYPES = 'address,country,place'

export default defineEventHandler(async (event) => {
	const query = getQuery(event)

	const text = query.text || ''
	const coords = query.coords || ''

	let res: any

	if (text) {
		const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?types=${TYPES}&access_token=${process.env.MAPBOX_PUBLIC_API}`
		res = await $fetch(url)
	}
	if (coords) {
		const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords}.json?types=${TYPES}&access_token=${process.env.MAPBOX_PUBLIC_API}`
		res = await $fetch(url)
	}

	return {
		data: res,
		status: 'Success!',
	}
})
