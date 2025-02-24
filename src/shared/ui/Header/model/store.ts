import { defineStore } from 'pinia'
import { ref } from 'vue'
const { getOfferingsCount } = useOffering()

export const useHeaderStore = defineStore('header', () => {
	const isLiveOfferings = ref<null | boolean>(null)

	const fetchLiveOfferings = () => {
		if (isLiveOfferings.value !== null) return

		getOfferingsCount().then(({ data }) => {
			isLiveOfferings.value = !!data.value?.data
		})
	}

	return { isLiveOfferings, fetchLiveOfferings }
})
