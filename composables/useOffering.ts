export default () => {
	const getAttributes = () => {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await useFetch('/api/offeringAttributes')

				resolve(data)
			} catch (error) {
				reject(error)
			}
		})
	}
	return {
		getAttributes,
	}
}
