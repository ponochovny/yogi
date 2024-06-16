import { type TOfferingCreationData } from '~/helpers/types/offering'
import type { IFeature, TMarker } from '~/helpers/types/map'

export default (
	location: Ref<TOfferingCreationData['location']>,
	isUpdate: boolean
) => {
	const centerFn = () => {
		// if (!props.offering) return [0, 0]
		// if (!props.offering.location) return [0, 0]
		// if (!props.offering.location.coords) return [0, 0]
		// if (props.offering.location.coords.length === 2) {
		// 	return [
		// 		props.offering.location?.coords[1],
		// 		props.offering.location?.coords[0],
		// 	]
		// }
		return [0, 0]
	}
	const center = centerFn()

	const _location = ref<{
		center: number[]
		id: string
		place_name: string
	} | null>({
		center,
		id: '',
		place_name: '',
	})
	const resetLocation = () => {
		_location.value = {
			center,
			id: '',
			place_name: '',
		}
	}
	watch(
		() => _location.value,
		(val) => {
			location.value = {
				coords: val ? [val?.center[1], val?.center[0]] : [0, 0],
				name: val?.place_name || '',
			}
		}
	)

	const isShowMap = ref(false)
	const map = ref<any>(null)
	const selectComponent = ref<any>(null)
	const features = ref<IFeature[]>([])
	function setFeatures(data: IFeature[]) {
		features.value = data

		if (data.length) {
			// selectComponent.value?.open()
		} else {
			selectComponent.value?.close()
		}
	}
	function featureSelected(feature: IFeature) {
		_location.value = feature
	}
	function getMarkers(): TMarker | undefined {
		if (_location.value) {
			const formDataMarker = {
				coords: [_location.value?.center[1], _location.value?.center[0]],
				name: _location.value?.place_name,
			}
			return { ...formDataMarker }
		}
		// if (props.offering?.location) {
		// 	return props.offering.location
		// }
		return
	}
	function getCenter(): number[] {
		if (_location.value) {
			return [_location.value.center[1], _location.value.center[0]]
		}
		// if (props.offering?.location) {
		// 	return [...props.offering.location.coords]
		// }
		return [0, 0]
	}
	function resetMarker(mapRerender?: boolean) {
		// if (props.offering) {
		// 	const centerFn = () => {
		// 		if (!props.offering) return [0, 0]
		// 		if (!props.offering.location) return [0, 0]
		// 		if (!props.offering.location.coords) return [0, 0]
		// 		if (props.offering.location.coords.length === 2) {
		// 			return [
		// 				props.offering.location?.coords[1],
		// 				props.offering.location?.coords[0],
		// 			]
		// 		}
		// 		return [0, 0]
		// 	}
		// 	formData.location = {
		// 		center: centerFn(),
		// 		id: props.offering.location?.name || '',
		// 		place_name: props.offering.location?.name || '',
		// 	}
		// }
		if (isShowMap.value && mapRerender) {
			isShowMap.value = false
			setTimeout(() => {
				isShowMap.value = true
			}, 0)
		}
	}
	function markerRemoved() {
		if (isUpdate) {
			resetMarker()
		} else {
			_location.value = null
		}
	}
	return {
		_location,
		features,
		isShowMap,
		getCenter,
		getMarkers,
		resetMarker,
		setFeatures,
		featureSelected,
		markerRemoved,
		resetLocation,
	}
}
