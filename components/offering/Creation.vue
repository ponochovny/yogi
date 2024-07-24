<template>
	<div class="flex flex-col gap-3 lg:pr-0 pr-6 max-w-[600px]">
		<Input
			v-model="formData.name"
			label="Offering name"
			placeholder="Offering name"
		/>
		<div class="flex gap-2 flex-col sm:flex-row">
			<Datepicker label="Start" v-model="formData.start" />
			<Datepicker label="End" v-model="formData.end" />
		</div>
		<Yselect
			v-model="formData.activity"
			label="Activity type"
			:options="['Class', 'Event', 'Appointment']"
		/>

		<div class="flex gap-3 sm:gap-2 flex-col sm:flex-row">
			<Input
				v-model="formData.duration"
				label="Offering duration"
				placeholder="Offering duration"
				type="number"
			/>
			<Input
				v-model="formData.spots"
				label="Offering spots"
				placeholder="Offering spots"
				type="number"
			/>
			<div class="flex space-x-2 sm:pb-3 self-end items-center mr-auto">
				<Switch
					id="airplane-mode"
					:checked="formData.is_private"
					@update:checked="formData.is_private = $event"
				/>
				<label for="airplane-mode">Private</label>
			</div>
		</div>

		<Textarea
			v-model="formData.description"
			label="Offering description"
			placeholder="Offering description"
		/>
		<div class="flex gap-3 sm:gap-2 flex-col sm:flex-row">
			<Yselect
				v-model="formData.categories"
				label="Categories"
				:options="_categories"
				field="name"
				value-prop="name"
				mode="multiple"
			/>
			<Yselect
				v-model="formData.types"
				label="Types"
				:options="_types"
				field="name"
				value-prop="name"
				mode="multiple"
			/>
		</div>

		<div class="flex gap-3 sm:gap-2 flex-col sm:flex-row">
			<Yselect
				label="Offering location"
				ref="selectComponent"
				class="w-full"
				mode="single"
				v-model="formData.location"
				field="place_name"
				valueProp="id"
				object
				:options="features"
				placeholder="Find place on the map"
			/>
			<button
				v-if="isResetMarkerBtn"
				@click="resetMarker(true)"
				class="flex items-center justify-center h-[42px] self-end rounded-md border border-gray-300 px-2 hover:bg-gray-100 shadow-sm mr-auto"
				title="Reset"
			>
				<ArrowPathIcon class="w-6 text-gray-600 stroke-1" />
			</button>
			<button
				@click="isShowMap = !isShowMap"
				class="flex items-center justify-center h-[42px] self-end rounded-md border border-gray-300 px-2 hover:bg-gray-100 shadow-sm mr-auto"
				title="Open map"
			>
				<MapIcon class="w-6 text-gray-600 stroke-1" />
			</button>
			<Yselect
				v-model="formData.timezone"
				label="Timezone"
				:options="_timezones"
				searchable
				field="tzId"
				value-prop="tzId"
			/>
		</div>
		<div v-if="isShowMap" class="w-full h-[400px]">
			<Map
				ref="map"
				allowMarkerCreation
				searchable
				:center="getCenter()"
				:sMarker="getMarkers()"
				:zoom="updateData ? 12 : 3"
				@features="setFeatures"
				@featureSelected="featureSelected"
				@markerRemoved="markerRemoved"
			/>
		</div>
		<!-- <div class="flex gap-2">
			<Input
				v-model="formData.location"
				label="Offering location"
				placeholder="Offering location"
			/>
			<Yselect
				v-model="formData.timezone"
				label="Timezone"
				:options="_timezones"
				searchable
				field="tzId"
				value-prop="tzId"
			/>
		</div> -->

		<!-- PRACTITIONERS SELECT -->
		<Yselect
			mode="tags"
			v-model="formData.practitioners"
			label="Practitioners"
			:options="practitionersOptions"
			object
			placeholder="Select practitioners"
			searchable
			field="name"
			value-prop="name"
		/>

		<OfferingTicketsList
			label="Tickets"
			:tickets="formData.tickets"
			@remove="removeTicket"
		/>

		<Button
			variant="primaryOutline"
			btnSize="md2"
			@click="addEmptyTicket"
			class="self-start"
		>
			<span>+ Add more</span>
		</Button>

		<ModuleImagesGalleryUploader
			:data="bannersUpdate"
			@change="moduleImagesChange"
			:stencilProps="{
				aspectRatio: 2.7 / 1,
			}"
		/>

		<Button @click="handleForm" class="self-start">
			<span class="font-semibold">
				{{ updateData ? 'Update' : 'Create' }}
			</span>
		</Button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import timezones from '~/helpers/timeZones.json'
import _data from '~/helpers/offeringAttributes.json'
import { toast } from 'vue-sonner'
import type { TOffering } from '~/helpers/types/offering'
import randomOfferingData from '~/helpers/randomOfferingData.json'
import type { IFeature, TMarker } from '~/helpers/types/map'
import { MapIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import type { TTicket } from '~/helpers/types/ticket'

export default defineComponent({
	name: 'OfferingCreation',
})
</script>
<script lang="ts" setup>
interface IProps {
	updateData?: boolean
	offering?: TOffering | null
}
const props = withDefaults(defineProps<IProps>(), {
	updateData: false,
})
const emit = defineEmits(['updated'])

const isResetMarkerBtn = computed(
	() =>
		props.offering?.location?.name !== formData.location?.place_name &&
		props.offering?.location
)

// const loading = ref(false)

// const isButtonDisabled = computed(() => {
// 	if (loading.value) return true
// 	if (props.updateData && props.studio) {
// 		const currentFields = {
// 			name: formData.name,
// 			location: formData.location,
// 			timezone: formData.timezone,
// 			currency: formData.currency,
// 			categories: formData.categories,
// 			types: formData.types,
// 			bio: formData.bio,
// 			mission: formData.mission,
// 			logo: logoImageUrl.value,
// 			banner: bannerImageUrl.value,
// 			practitioners: formData.practitioners,
// 		}
// 		const studioData = {
// 			name: props.studio.name,
// 			location: props.studio.location[0],
// 			timezone: props.studio.timezone,
// 			currency: props.studio.currency,
// 			categories: props.studio.categories,
// 			types: props.studio.types,
// 			bio: props.studio.bio,
// 			mission: props.studio.mission,
// 			logo: props.studio.logo.length ? props.studio.logo.url || '' : '',
// 			banner: props.studio.banner.length
// 				? props.studio.banner[0].url || ''
// 				: '',
// 			practitioners: props.studio.practitioners.map((el) => ({
// 				name: el.name,
// 				profileImage: el.profileImage,
// 				id: el.id,
// 			})),
// 		}
// 		const isEqualState = isEqual(currentFields, studioData)

// 		return isEqualState
// 	}
// 	return false
// })

const { createOffering, updateOffering } = useOffering()
const route = useRoute()
// const selectedFileLogo = ref(null)
// const logoImageUrl = ref<string | null>(null)
// const selectedFileBanner = ref(null)
const bannerImageUrl = ref<string | null>(null)
const _timezones = timezones
// const _currencies = currencies
const _categories = _data.categories
const _types = _data.types
const _randomOfferingData = randomOfferingData
const randomNames = _randomOfferingData.names
const studioId = route.params.id
const showBannersUploader = ref(true)

function getDifference(oldArray: string[], newArray: string[]) {
	return oldArray.filter((x) => !newArray.includes(x))
}

// Media
const bannersDelete = ref<string[]>([])
const bannersOrder = ref<(string | null)[]>([])
const bannersFiles = ref<any[]>([])
// function setBannersFiles(files: any) {
// 	bannersFiles.value = [...files]
// }

const formData = reactive<{
	name: string
	start: Date
	end: Date
	activity: 'Class' | 'Event' | 'Appointment'
	duration: string
	description: string
	spots: string
	is_private: boolean
	categories: string[]
	types: string[]
	location: IFeature | null
	timezone: string
	practitioners: { name: string; id: string; profileImage: string }[]
	tickets: {
		name: string
		description: string
		price: string
		currency: string
		status: 'active' | 'inactive' | string
		id?: string
	}[]
}>({
	name: '',
	start: new Date(),
	end: new Date(),
	activity: 'Class',
	duration: '',
	description: '',
	spots: '',
	is_private: false,
	categories: [],
	types: [],
	location: null,
	timezone: _timezones[0].tzId,
	practitioners: [],
	tickets: [
		{
			name: '',
			description: '',
			price: '',
			currency: 'usd',
			status: 'active',
		},
	],
})

function resetFormData() {
	formData.name = ''
	formData.start = new Date()
	formData.end = new Date()
	formData.activity = 'Class'
	formData.duration = ''
	formData.description = ''
	formData.spots = ''
	formData.is_private = false
	formData.categories = []
	formData.types = []
	formData.location = null
	formData.timezone = _timezones[0].tzId
	formData.practitioners = []
	formData.tickets = [
		{
			name: '',
			description: '',
			price: '',
			currency: 'usd',
			status: 'active',
		},
	]
}
const emptyTicket = {
	name: '',
	description: '',
	price: '',
	currency: 'usd',
	status: 'active',
}

watch(
	() => props.offering,
	(val) => {
		if (!val) return

		bannerImageUrl.value = val.banners.length ? val.banners[0].url : ''
	}
)

onMounted(() => {
	if (!(props.offering && props.updateData)) {
		formData.name = randomNames[Math.floor(Math.random() * randomNames.length)]
	}
})

const bannersUpdate = ref<{ id: string; url: string }[]>([])
onBeforeMount(() => {
	if (props.offering && props.updateData) {
		bannersUpdate.value = props.offering.banners.map((el) => ({
			id: el.id || '',
			url: el.url,
		}))
		const centerFn = () => {
			if (!props.offering) return [0, 0]
			if (!props.offering.location) return [0, 0]
			if (!props.offering.location.coords) return [0, 0]
			if (props.offering.location.coords.length === 2) {
				return [
					props.offering.location?.coords[1],
					props.offering.location?.coords[0],
				]
			}
			return [0, 0]
		}
		const center = centerFn()
		const loc = {
			center,
			id: props.offering.location?.name || '',
			place_name: props.offering.location?.name || '',
		}
		formData.name = props.offering.name
		formData.description = props.offering.description
		formData.activity = (props.offering.activity.charAt(0).toUpperCase() +
			props.offering.activity.slice(1)) as unknown as
			| 'Class'
			| 'Appointment'
			| 'Event'
		formData.start = new Date(props.offering.start)
		formData.end = new Date(props.offering.end)
		formData.is_private = props.offering.is_private
		formData.duration = props.offering.duration.toString()
		formData.spots = props.offering.spots.toString()
		formData.location = props.offering.location ? loc : null
		formData.categories = props.offering.categories
		formData.types = props.offering.types
		formData.timezone = props.offering.timezone
		formData.practitioners = props.offering.practitioners as unknown as {
			name: string
			id: string
			profileImage: string
		}[]

		const isTicketsExist = !!props.offering.tickets?.length

		const transformedTicket = (ticket: TTicket): TTicket => {
			return {
				...ticket,
				price: (ticket.price_int / 100).toString(),
			}
		}
		formData.tickets =
			isTicketsExist && props.offering.tickets
				? props.offering.tickets.map(transformedTicket)
				: [{ ...emptyTicket }]
	}
})

function addEmptyTicket() {
	formData.tickets.push({ ...emptyTicket })
}
function removeTicket(idx: any) {
	formData.tickets.splice(idx, 1)
}

// Practitioners
const practitionersOptions = ref<any[]>([])
onMounted(async () => {
	useFetchApi('/api/studios/practitioners', {
		method: 'POST',
		body: {
			studio_id: studioId,
		},
	}).then(({ data }: any) => {
		practitionersOptions.value = [...data]
	})
})

// LOCATION >
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
	formData.location = feature
}
function getMarkers(): TMarker | undefined {
	if (formData.location) {
		const formDataMarker = {
			coords: [formData.location?.center[1], formData.location?.center[0]],
			name: formData.location?.place_name,
		}
		return { ...formDataMarker }
	}
	if (props.offering?.location) {
		return props.offering.location
	}
	return
}
function getCenter(): number[] {
	if (formData.location) {
		return [formData.location.center[1], formData.location.center[0]]
	}
	if (props.offering?.location) {
		return [...props.offering.location.coords]
	}
	return [0, 0]
}
function resetMarker(mapRerender?: boolean) {
	if (props.offering) {
		const centerFn = () => {
			if (!props.offering) return [0, 0]
			if (!props.offering.location) return [0, 0]
			if (!props.offering.location.coords) return [0, 0]
			if (props.offering.location.coords.length === 2) {
				return [
					props.offering.location?.coords[1],
					props.offering.location?.coords[0],
				]
			}
			return [0, 0]
		}
		formData.location = {
			center: centerFn(),
			id: props.offering.location?.name || '',
			place_name: props.offering.location?.name || '',
		}
	}
	if (isShowMap.value && mapRerender) {
		isShowMap.value = false
		setTimeout(() => {
			isShowMap.value = true
		}, 0)
	}
}
function markerRemoved() {
	if (props.updateData) {
		resetMarker()
	} else {
		formData.location = null
	}
}
// LOCATION <

function handleForm() {
	if (props.updateData) {
		updateOfferingHandler()
	} else {
		createOfferingHandler()
	}
}

function moduleImagesChange(data: { id: string | null; file: File }[]) {
	const isUpdate = props.offering && props.updateData

	if (isUpdate) {
		const findMissingElements = (
			arr1: { id: string | null }[],
			arr2: { id: string }[]
		): string[] => {
			return arr2
				.filter((item2) => typeof item2.id === 'string')
				.filter((item2) => !arr1.some((item1) => item1.id === item2.id))
				.map((item) => item.id) as string[]
		}
		const oldIds = props.offering?.banners.map((el) => ({
			id: el.id as string,
		}))
		const missingIds = findMissingElements(data, oldIds)
		const croppedImagesIds = data
			.filter((el) => el.file && el.id)
			.map((el) => el.id) as string[]

		bannersDelete.value = missingIds.concat(croppedImagesIds)
	}

	bannersOrder.value = data.map((el) => (el.file && el.id ? null : el.id))
	bannersFiles.value = data.map((el) => el.file)
}

async function updateOfferingHandler() {
	if (!props.offering?.id) return

	const oldPracs = props.offering.practitioners.map((el) => el.id)
	const updatedPracs = formData.practitioners.map((el) => el.id)
	const practitionersRemove = getDifference(oldPracs, updatedPracs)
	const newPracs = updatedPracs.filter(
		(el) => !oldPracs.some((_el) => _el === el)
	)

	const oldTickets = props.offering.tickets?.map((el) => el.id) || []
	const updatedTickets = formData.tickets.map((el) => el?.id || '')
	const newTickets = formData.tickets.filter((el) => !el.id)
	const ticketsRemove = getDifference(oldTickets, updatedTickets)

	const deepCloned = useCloneDeep({
		...formData,
		name: formData.name,
		activity: formData.activity.toLowerCase() as
			| 'appointment'
			| 'class'
			| 'event',
		location: {
			coords: formData.location
				? [formData.location?.center[1], formData.location?.center[0]]
				: [],
			name: formData.location?.place_name || '',
		},
		duration: +formData.duration,
		spots: +formData.spots,
		start: new Date(formData.start),
		end: new Date(formData.end),
		bannersDelete: bannersDelete.value,
		bannersOrder: bannersOrder.value,
		banners: bannersFiles.value,
		studioId: isArray(studioId)
			? (studioId[0] as string)
			: (studioId as string),
		tickets: newTickets,
		ticketsRemove,
		practitioners: newPracs,
		practitionersRemove,
		isActive: props.offering.isActive,
	})
	updateOffering(deepCloned, props.offering.id)
		.then(() => {
			emit('updated')
			toast.success(
				`Offering data has been updated. ${
					practitionersRemove.length
						? practitionersRemove.length + ' practitioner(s) removed.'
						: ''
				} ${
					ticketsRemove.length
						? ticketsRemove.length + ' ticket(s) set inactive.'
						: ''
				}`
			)
		})
		.catch((error: any) => {
			console.log(error)
			toast.error('Error ocurred')
		})
}
async function createOfferingHandler() {
	const deepCloned = useCloneDeep({
		...formData,
		practitioners: formData.practitioners.map((el) => el.id),
		activity: formData.activity.toLowerCase() as
			| 'appointment'
			| 'class'
			| 'event',
		location: {
			coords: formData.location
				? [formData.location?.center[1], formData.location?.center[0]]
				: [],
			name: formData.location?.place_name || '',
		},
		duration: +formData.duration,
		spots: +formData.spots,
		start: new Date(formData.start),
		end: new Date(formData.end),
		bannersDelete: bannersDelete.value,
		bannersOrder: bannersOrder.value,
		banners: bannersFiles.value,
		studioId: isArray(studioId)
			? (studioId[0] as string)
			: (studioId as string),
		isActive: false,
	})
	createOffering(deepCloned)
		.then(() => {
			resetFormData()
			bannersFiles.value = []
			emit('updated')
			toast.success('Offering has been added')
		})
		.catch((error) => {
			console.log(error)
			toast.error(error)
		})
}
</script>
