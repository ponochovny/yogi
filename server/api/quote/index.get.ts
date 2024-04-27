export default defineEventHandler(async () => {
	const res = await $fetch<{ a: string; q: string }[]>(
		'https://zenquotes.io/api/today'
	)

	return {
		data: {
			author: res[0].a,
			quote: res[0].q,
		},
		status: 'Success!',
	}
})
