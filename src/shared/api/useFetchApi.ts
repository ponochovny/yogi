export const useFetchApi: typeof $fetch = (url, options = {}) => {
	const headers = useRequestHeaders(['cookie'])

	return $fetch(url, {
		...options,
		headers: {
			...headers,
			...options.headers,
		},
	})
}
