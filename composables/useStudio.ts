import type { TMarker } from '~/helpers/types/map'
import type { TStudio } from '~/helpers/types/studio'

interface IData {
	name: string
	location: TMarker | null
	timezone: string
	currency: string
	categories: string[]
	types: string[]
	bio: string
	mission: string
	mediaFiles: {
		logo: any
		banner: any
	}
	practitioners: {
		name: string
		profileImage: string
		id: string
	}[]
}

export default () => {
	const createStudio = (data: IData) => {
		const form = new FormData()

		const { mediaFiles, practitioners, location, ...rest } = data

		Object.keys(rest).map((key: string) => {
			// @ts-ignore
			form.append(key, data[key])
		})
		for (const practitioner of practitioners) {
			form.append('practitioners[]', practitioner.id)
		}
		if (data.mediaFiles.logo) {
			form.append('logo', data.mediaFiles.logo)
		}
		if (data.mediaFiles.banner) {
			form.append('banner', data.mediaFiles.banner)
		}
		if (location) {
			form.append('location', JSON.stringify(location))
		}

		return useFetchApi('/api/studios', {
			method: 'POST',
			body: form,
		})
	}
	const updateStudio = (data: IData, studioId: string) => {
		const form = new FormData()

		const { mediaFiles, practitioners, location, ...rest } = data

		form.append('studio_id', studioId)

		Object.keys(rest).map((key: string) => {
			// @ts-ignore
			form.append(key, data[key])
		})
		for (const practitioner of practitioners) {
			form.append('practitioners[]', practitioner.id)
		}
		if (data.mediaFiles.logo) {
			form.append('logo', data.mediaFiles.logo)
		}
		if (data.mediaFiles.banner) {
			form.append('banner', data.mediaFiles.banner)
		}
		if (location) {
			form.append('location', JSON.stringify(location))
		}

		return useFetchApi('/api/studios/update', {
			method: 'POST',
			body: form,
		})
	}

	const getStudios = (queries?: string) => {
		return useFetchApi<{ data: TStudio[] }>(
			`/api/studios${queries ? '?' + queries : ''}`
		)
	}
	const getStudiosOpen = (queries?: string) => {
		return useFetch<{ data: TStudio[] }>(
			`/api/studios${queries ? '?' + queries : ''}`
		)
	}

	return {
		createStudio,
		updateStudio,
		getStudios,
		getStudiosOpen,
	}
}
