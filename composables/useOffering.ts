interface IData {
	mediaFiles?: any
}

export default () => {
	const createOffering = (data: IData) => {
		const form = new FormData()

		const { mediaFiles, ...rest } = data

		Object.keys(rest).map((key: string) => {
			// @ts-ignore
			form.append(key, data[key])
		})
		if (data.mediaFiles.logo) {
			form.append('logo', data.mediaFiles.logo)
		}

		return useFetchApi('/api/offerings', {
			method: 'POST',
			body: form,
		})
	}

	const getOfferings = () => {
		return useFetch('/api/offerings')
	}

	return {
		createOffering,
		getOfferings,
	}
}
