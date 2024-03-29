<template>
	<div class="flex flex-col gap-3 max-w-[600px]">
		<Input
			v-model="formData.name"
			label="Offering name"
			placeholder="Offering name"
		/>
		<div class="flex gap-2">
			<Datepicker label="Start" v-model="formData.start" />
			<Datepicker label="End" v-model="formData.end" />
		</div>
		<Yselect
			v-model="formData.activity"
			label="Activity type"
			:options="['Class', 'Event', 'Appointment']"
		/>

		<div class="flex gap-2">
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
			<div class="flex space-x-2 pb-3 self-end items-center">
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
		<div class="flex gap-2">
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
		<div class="flex gap-2">
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
		</div>

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

		<!-- @files="setBannersFiles" -->
		<FileUploadCustom
			label="Banners"
			v-model:files="bannersFiles"
			:uploaded="offering ? offering.banners.map((el: any) => el.url) : []"
			v-if="showBannersUploader"
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
import type { IOffering, ITicket } from '~/helpers/types/offering'
import randomOfferingData from '~/helpers/randomOfferingData.json'

export default defineComponent({
	name: 'OfferingCreation',
})
</script>
<script lang="ts" setup>
interface IProps {
	updateData?: boolean
	offering?: IOffering
}
const props = withDefaults(defineProps<IProps>(), {
	updateData: false,
})
const emit = defineEmits(['updated'])

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
// 			logo: props.studio.logo.length ? props.studio.logo[0].url || '' : '',
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

const {
	createOffering,
	// updateOffering
} = useOffering()
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

// Media
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
	location: string
	timezone: string
	practitioners: { name: string; id: string; profileImage: string }[]
	tickets: {
		name: string
		description: string
		price: string
		currency: string
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
	location: '',
	timezone: _timezones[0].tzId,
	practitioners: [],
	tickets: [
		{
			name: '',
			description: '',
			price: '',
			currency: 'usd',
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
	formData.location = ''
	formData.timezone = _timezones[0].tzId
	formData.practitioners = []
	formData.tickets = [
		{
			name: '',
			description: '',
			price: '',
			currency: 'usd',
		},
	]
}
const emptyTicket = {
	name: '',
	description: '',
	price: '',
	currency: 'usd',
}

watch(
	() => props.offering,
	(val) => {
		if (!val) return

		bannerImageUrl.value = val.banners.length ? val.banners[0].url : ''

		// loading.value = false
	}
)

onMounted(() => {
	if (!(props.offering && props.updateData)) {
		formData.name = randomNames[Math.floor(Math.random() * randomNames.length)]
	}
})
onBeforeMount(() => {
	if (props.offering && props.updateData) {
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
		formData.location = props.offering.location[0]
		formData.categories = props.offering.categories
		formData.types = props.offering.types
		formData.timezone = props.offering.timezone
		formData.practitioners = props.offering.practitioners as unknown as {
			name: string
			id: string
			profileImage: string
		}[]

		const isTicketsExist = !!props.offering.tickets?.length

		const transformedTicket = (ticket: ITicket) => {
			return {
				...ticket,
				price: ticket.price.toString(),
			}
		}
		formData.tickets = isTicketsExist
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

function handleForm() {
	if (props.updateData) {
		// TODO: add update offering method
		// updateOfferingHandler()
		alert('Update')
	} else {
		createOfferingHandler()
	}
}

async function createOfferingHandler() {
	const deepCloned = useCloneDeep({
		...formData,
		activity: formData.activity.toLowerCase() as
			| 'appointment'
			| 'class'
			| 'event',
		location: [formData.location],
		duration: +formData.duration,
		spots: +formData.spots,
		start: new Date(formData.start),
		end: new Date(formData.end),
		banners: bannersFiles.value,
		studioId: isArray(studioId)
			? (studioId[0] as string)
			: (studioId as string),
	})
	createOffering(deepCloned)
		.then(() => {
			resetFormData()
			showBannersUploader.value = false
			setTimeout(() => {
				showBannersUploader.value = true
			}, 500)
			bannersFiles.value = []
			toast.success('Offering has been added')
		})
		.catch((error) => {
			console.log(error)
			toast.error(error)
		})
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
</script>
