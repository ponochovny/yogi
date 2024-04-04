import type {
	IOffering,
	IOfferingCreation,
	IOfferingUpdate,
} from '~/helpers/types/offering'

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
		for (const practitionerId of practitioners) {
			form.append('practitioners[]', practitionerId)
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

	const updateOffering = (
		data: Omit<IOfferingUpdate, 'slug'>,
		offeringId: string
	) => {
		const form = new FormData()

		const {
			banners,
			practitioners,
			practitionersRemove,
			tickets,
			ticketsRemove,
			...rest
		} = data

		Object.keys(rest).map((key: string) => {
			//@ts-ignore
			form.append(key, data[key])
		})

		// Banner
		for (const banner of banners) {
			form.append('fileToUpload[]', banner)
		}

		// Practitioners
		for (const practitionerId of practitioners) {
			form.append('practitioners[]', practitionerId)
		}
		for (const practitionerId of practitionersRemove) {
			form.append('practitionersRemove[]', practitionerId)
		}

		// Tickets
		for (const ticket of tickets) {
			form.append('tickets[]', JSON.stringify(ticket))
		}
		for (const ticketId of ticketsRemove) {
			form.append('ticketsRemove[]', ticketId)
		}

		return useFetchApi('/api/offerings/update?id=' + offeringId, {
			method: 'PUT',
			body: form,
		})
	}

	const getOfferings = () => {
		return useFetch<{ data: IOffering[] }>('/api/offerings')
	}

	const getOfferingsByStudioId = (id: string) => {
		return useFetch<{ data: IOffering[]; refresh: any }>(
			'/api/offerings/byStudio/' + id,
			{ immediate: false }
		)
	}

	const removePractitioners = (pracIds: string[], offeringId: string) => {
		return useFetchApi('/api/practitioners', {
			method: 'DELETE',
			body: pracIds.map((pracId) => ({
				practitioner: { id: pracId, offeringId },
			})),
		})
	}

	return {
		createOffering,
		getOfferings,
		getOfferingsByStudioId,
		updateOffering,
		removePractitioners,
	}
}
