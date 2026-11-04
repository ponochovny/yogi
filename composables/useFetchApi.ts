export default <T>(url: string, options: any = {}): Promise<T> => {
	return $fetch<T>(url, {
		...options,
		headers: {
			...(import.meta.server ? useRequestHeaders(['cookie']) : {}),
			...options.headers,
		},
	})
}
