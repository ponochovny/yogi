export default defineEventHandler(async () => {
	const res = await $fetch<{ a: string; q: string }[]>(
		'https://zenquotes.io/api/today'
	)
	const quote = res[0]
	if (!quote) {
		throw createError({
			statusCode: 502,
			statusMessage: 'Quote service returned no quotes',
		})
	}

	return {
		data: {
			author: quote.a,
			quote: quote.q,
		},
		status: 'Success!',
	}
})
