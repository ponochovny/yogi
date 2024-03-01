export default <T>(url: string, options: any = {}): Promise<T> => {
	const { useAuthToken } = useAuth()

	// TODO: set type
	// @ts-ignore
	return $fetch(url, {
		...options,
		headers: {
			...options.headers,
			Authorization: `Bearer ${useAuthToken().value}`,
		},
	})
}
