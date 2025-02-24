import type {
	IOfferingUpdateData,
	TOffering,
	TOfferingCreationData,
} from '~/src/app/types/offering'

export default () => {
	const createOffering = (data: TOfferingCreationData) => {
		const { banners, location, tickets, practitioners, ...rest } = data

		const form = new FormData()
		Object.keys(rest).map((key: string) => {
			form.append(key, data[key as keyof typeof data] as string | Blob)
		})

		// Location
		if (location) {
			form.append('location', JSON.stringify(location))
		}

		// Banners
		for (const banner of banners as File[]) {
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

	const getOfferingsCount = () => {
		return useFetch('/api/search/live', {
			method: 'GET',
		})
	}

	const updateOffering = (
		data: Omit<IOfferingUpdateData, 'slug'>,
		offeringId: string
	) => {
		const form = new FormData()

		const {
			banners,
			bannersDelete,
			bannersOrder,
			practitioners,
			practitionersRemove,
			tickets,
			ticketsRemove,
			location,
			...rest
		} = data

		Object.keys(rest).map((key: string) => {
			//@ts-ignore
			form.append(key, data[key])
		})

		// Banner
		form.append('bannersOrder', JSON.stringify(bannersOrder))
		form.append('bannersDelete', JSON.stringify(bannersDelete))
		for (const banner of banners as File[]) {
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

		if (location) {
			form.append('location', JSON.stringify(location))
		}

		return useFetchApi('/api/offerings/update?id=' + offeringId, {
			method: 'PUT',
			body: form,
		})
	}

	const getOfferings = (queries?: string, isLazy?: boolean) => {
		const uri = `/api/offerings${queries ? '?' + queries : ''}`

		if (isLazy) {
			return useLazyFetch<{ data: TOffering[] }>(uri)
		} else {
			return useFetch<{ data: TOffering[] }>(uri)
		}
	}

	const getOfferingsByStudioId = <T>(
		id: string,
		options?: { immediate: boolean }
	) => {
		return useFetch<T>('/api/offerings/byStudio/' + id, { ...options })
	}

	const toggleActiveOfferingById = <T>(id: string, val: boolean) => {
		return useFetchApi<T>('/api/offerings/update?id=' + id, {
			method: 'PUT',
			body: { isActive: val },
		})
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
		toggleActiveOfferingById,
		removePractitioners,
		getOfferingsCount,
	}
}
