export default <T = unknown>(url: string, options: any = {}): Promise<T> => {
	// @ts-expect-error Nitro $fetch typing mismatch with generic T
	return $fetch<T>(url, {
		...options,
		headers: {
			...(import.meta.server ? useRequestHeaders(['cookie']) : {}),
			...options.headers,
		},
	})
}
