import type { IOffering } from '~/helpers/types/offering'

interface IData {
	banners: any[]
	practitioners: {
		_id: { $oid: string }
		name: string
		profileImage: string
	}[]
}

export default () => {
	const createOffering = (data: IData) => {
		const form = new FormData()

		const { banners, practitioners, ...rest } = data

		Object.keys(rest).map((key: string) => {
			// @ts-ignore
			form.append(key, data[key])
		})
		for (const banner of banners) {
			form.append('fileToUpload[]', banner)
		}
		for (const practitioner of practitioners) {
			form.append('practitioners[]', practitioner._id.$oid)
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
