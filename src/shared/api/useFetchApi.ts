export const useFetchApi = $fetch.create({
	onRequest({ options }) {
		options.headers = {
			...useRequestHeaders(['cookie']),
			...options.headers,
		}
	},
})
