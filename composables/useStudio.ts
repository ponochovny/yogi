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
}

export default () => {
	const createStudio = (data: IData) => {
		const form = new FormData()

		const { mediaFiles, ...rest } = data

		Object.keys(rest).map((key: string) => {
			// @ts-ignore
			form.append(key, data[key])
		})
		form.append('logo', data.mediaFiles.logo)

		return useFetchApi('/api/studio', {
			method: 'POST',
			body: form,
		})
	}

	const getStudios = () => {
		return useFetchApi<{ studios: IStudio[] }>('/api/studio')
	}

	return {
		createStudio,
		getStudios,
	}
}