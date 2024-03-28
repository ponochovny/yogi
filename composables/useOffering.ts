import type { IOffering, IOfferingCreation } from '~/helpers/types/offering'

export default () => {
	const createOffering = (data: Omit<IOfferingCreation, 'slug'>) => {
		const form = new FormData()

		const { banners, practitioners, tickets, ...rest } = data

		Object.keys(rest).map((key: string) => {
			//@ts-ignore
			form.append(key, data[key])
		})

		// Banner
		for (const banner of banners) {
			form.append('fileToUpload[]', banner)
		}

		// Practitioners
		for (const practitioner of practitioners) {
			form.append('practitioners[]', practitioner.id)
		}

		// Tickets
		for (const ticket of tickets) {
			form.append('tickets[]', JSON.stringify(ticket))
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
