import type { IStudio } from '~/helpers/types/studio'

interface IData {
	name: string
	location: string
	timezone: string
	currency: string
	categories: string[]
	types: string[]
	bio: string
	mission: string
	mediaFiles: {
		logo: any
	}
	practitioners: {
		name: string
		profileImage: string
		_id: {
			$oid: string
		}
	}[]
}

export default () => {
	const createStudio = (data: IData) => {
		const form = new FormData()

		const { mediaFiles, ...rest } = data

		Object.keys(rest).map((key: string) => {
			// @ts-ignore
			form.append(key, data[key])
		})
		if (data.mediaFiles.logo) {
			form.append('logo', data.mediaFiles.logo)
		}

		return useFetchApi('/api/studios', {
			method: 'POST',
			body: form,
		})
	}
	const updateStudio = (data: IData, studioId: string) => {
		const form = new FormData()

		const { mediaFiles, practitioners, ...rest } = data

		form.append('studio_id', studioId)

		Object.keys(rest).map((key: string) => {
			// @ts-ignore
			form.append(key, data[key])
		})
		for (const practitioner of practitioners) {
			form.append('practitioners[]', practitioner._id.$oid)
		}
		if (data.mediaFiles.logo) {
			form.append('logo', data.mediaFiles.logo)
		}

		return useFetchApi('/api/studios/update', {
			method: 'POST',
			body: form,
		})
	}

	const getStudios = () => {
		return useFetchApi<{ data: IStudio[] }>('/api/studios')
	}

	return {
		createStudio,
		updateStudio,
		getStudios,
	}
}
