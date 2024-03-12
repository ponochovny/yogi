import type { IOffering } from '~/helpers/types/offering'

interface IData {
	banners: any[]
}

export default () => {
	const createOffering = (data: IData) => {
		const form = new FormData()

		const { banners, ...rest } = data

		Object.keys(rest).map((key: string) => {
			// @ts-ignore
			form.append(key, data[key])
		})
		for (const banner of banners) {
			form.append('fileToUpload[]', banner)
		}

		return useFetchApi('/api/offerings', {
			method: 'POST',
			body: form,
		})
	}

	const getOfferings = () => {
		return useFetch<{ data: IOffering[] }>('/api/offerings')
	}

	return {
		createOffering,
		getOfferings,
	}
}
