<template>
	<div class="flex flex-col gap-3 lg:pr-0 pr-6 max-w-[600px]">
		<form @submit.prevent="onSubmit" class="flex flex-col gap-4">
			<Field v-model="name" name="name" v-slot="{ field, errorMessage }">
				<Input
					v-bind="field"
					v-model="name"
					label="Offering name"
					placeholder="Offering name"
					:error="errorMessage"
				/>
			</Field>
			<div class="flex gap-2 flex-col sm:flex-row">
				<Datepicker v-if="start" label="Start" v-model="start" />
				<Datepicker v-if="end" label="End" v-model="end" />
			</div>
			<Yselect
				v-model="activity"
				label="Activity type"
				field="label"
				valueProp="value"
				:options="[
					{
						value: 'class',
						label: 'Class',
					},
					{
						value: 'event',
						label: 'Event',
					},
					{
						value: 'appointment',
						label: 'Appointment',
					},
				]"
			/>

			<div class="flex gap-3 sm:gap-2 flex-col sm:flex-row">
				<Field
					v-model="duration"
					name="duration"
					v-slot="{ field, errorMessage }"
				>
					<Input
						v-bind="field"
						:modelValue="duration"
						@update:modelValue="duration = Number($event)"
						label="Offering duration"
						placeholder="Offering duration"
						type="number"
						:error="errorMessage"
					/>
				</Field>

				<Field v-model="spots" name="spots" v-slot="{ field, errorMessage }">
					<Input
						v-bind="field"
						:modelValue="spots"
						@update:modelValue="spots = Number($event)"
						label="Offering spots"
						placeholder="Offering spots"
						type="number"
						:error="errorMessage"
					/>
				</Field>
				<div
					class="flex space-x-2 sm:pb-3 self-start md:mt-8 items-center mr-auto"
				>
					<Switch
						id="is_private"
						:checked="is_private"
						@update:checked="is_private = $event"
					/>
					<label for="is_private">Private</label>
				</div>
			</div>

			<Textarea
				v-model="description"
				label="Offering description"
				placeholder="Offering description"
			/>
			<div class="flex gap-3 sm:gap-2 flex-col sm:flex-row">
				<Field
					v-model="categories"
					name="categories"
					v-slot="{ field, errorMessage }"
				>
					<Yselect
						v-bind="field"
						v-model="categories"
						label="Categories"
						:options="_categories"
						field="name"
						value-prop="name"
						mode="multiple"
						:error="errorMessage"
					/>
				</Field>
				<Field v-model="types" name="types" v-slot="{ field, errorMessage }">
					<Yselect
						v-bind="field"
						v-model="types"
						label="Types"
						:options="_types"
						field="name"
						value-prop="name"
						mode="multiple"
						:error="errorMessage"
					/>
				</Field>
			</div>
			<div class="flex gap-3 sm:gap-2 flex-col sm:flex-row">
				<Field
					v-model="location"
					name="location"
					v-slot="{ field, errorMessage }"
				>
					<Yselect
						v-bind="field"
						label="Offering location"
						ref="selectComponent"
						class="w-full"
						mode="single"
						v-model="_location"
						field="place_name"
						valueProp="id"
						object
						:options="features"
						placeholder="Find place on the map"
						:disabled="!features.length"
						:error="errorMessage"
					/>
				</Field>
				<button
					v-if="_location?.place_name && updateData"
					@click="resetMarker(true)"
					class="flex items-center justify-center h-[42px] self-start mt-7 rounded-md border border-gray-300 px-2 bg-white hover:bg-gray-100 shadow-sm mr-auto"
					title="Reset"
					type="button"
				>
					<ArrowPathIcon class="w-6 text-gray-600 stroke-1" />
				</button>
				<button
					@click="isShowMap = !isShowMap"
					class="flex items-center justify-center h-[42px] self-start mt-7 rounded-md border border-gray-300 px-2 bg-white hover:bg-gray-100 shadow-sm mr-auto"
					title="Open map"
					type="button"
				>
					<MapIcon class="w-6 text-gray-600 stroke-1" />
				</button>
				<Yselect
					v-if="timezone"
					v-model="timezone"
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
					:center="getCenter(offering)"
					:sMarker="getMarkers()"
					:zoom="updateData ? 12 : 3"
					@features="setFeatures"
					@featureSelected="featureSelected"
					@markerRemoved="markerRemoved"
				/>
			</div>

			<!-- PRACTITIONERS SELECT -->
			<Field name="practitioners" v-slot="{ field, errorMessage }">
				<Yselect
					v-bind="field"
					mode="tags"
					v-model="_practitioners"
					label="Practitioners"
					:options="practitionersOptions"
					object
					placeholder="Select practitioners"
					searchable
					field="name"
					value-prop="name"
					:error="errorMessage"
				/>
			</Field>

			<OfferingTicketsList
				v-if="tickets"
				label="Tickets"
				:tickets="tickets"
				@remove="removeTicket"
			/>

			<Button
				variant="outline"
				@click="addEmptyTicket"
				class="self-start"
				type="button"
			>
				<span>+ Add more</span>
			</Button>

			<ModuleImagesGalleryUploader
				ref="moduleImagesUploader"
				:data="bannersUpdate"
				@change="moduleImagesChange"
			/>

			<!-- <ul class="text-rose-600">
				<li v-for="(error, key) in errors" :key="key">{{ error }}</li>
			</ul> -->

			<div class="flex gap-2">
				<Button class="self-start">Submit</Button>
				<Button
					@click="resetFormHandler"
					variant="outline"
					type="button"
					class="self-start"
				>
					Reset form
				</Button>
			</div>
		</form>
	</div>
</template>

<script lang="ts">
import { useForm } from 'vee-validate'
import { defineComponent } from 'vue'
import _data from '~/helpers/offeringAttributes.json'
import {
	EActivity,
	offeringDataCreationSchemaTyped,
	type TOfferingCreationData,
} from '~/helpers/types/offering'
import type { TOffering } from '~/helpers/types/offering'
import { ArrowPathIcon, MapIcon } from '@heroicons/vue/24/outline'
import { toast } from 'vue-sonner'
import timezones from '~/helpers/timeZones.json'
import type { TMarker } from '~/helpers/types/map'
import type { TTicket } from '~/helpers/types/ticket'
import type { TTicketCreate } from '~/helpers/types/offering'
import type { TPractitioner } from '~/server/types'
import useBanners from './helpers/useBanners'
import useLocation from './helpers/useLocation'
import usePractitioners from './helpers/usePractitioners'
import useTickets from './helpers/useTickets'

export default defineComponent({
	name: 'CreationForm',
})
</script>
<script lang="ts" setup>
interface IProps {
	updateData?: boolean
	offering?: TOffering | null
	// studioId?: string
}
const props = defineProps<IProps>()
const router = useRouter()

// const studioId = computed(() => {
// 	const {id} = route.params
// 	return isArray(id)
// 			? (id[0] as string)
// 			: (id as string),

// })

// const offeringLocation = {
// 	center: [0, 0],
// 	id: props.offering?.location?.name || '',
// 	place_name: props.offering?.location?.name || '',
// }
const initialLocation = {
	coords: [0, 0],
	name: '',
}

const transformedTicket = (ticket: TTicket): TTicketCreate => {
	return {
		id: ticket.id,
		name: ticket.name,
		description: ticket.description,
		price: ticket.price_int / 100,
		currency: ticket.currency,
		status: ticket.status,
	}
}
const _categories = _data.categories
const _types = _data.types
const _timezones = timezones
const { values, meta, errors, handleSubmit, resetForm, defineField } = useForm({
	validationSchema: offeringDataCreationSchemaTyped,
	initialValues: {
		name: props.offering?.name || '',
		start: new Date(props.offering?.start || new Date()),
		end: new Date(props.offering?.end || new Date()),
		activity: (props.offering?.activity as EActivity) || EActivity.CLASS,
		banners: [],
		duration: props.offering?.duration || 0,
		description: props.offering?.description || '',
		spots: props.offering?.spots || 0,
		is_private: props.offering?.is_private || false,
		categories: props.offering?.categories || [],
		types: props.offering?.types || [],
		location: initialLocation,
		timezone: props.offering?.timezone || _timezones[0].tzId,
		practitioners: props.offering?.practitioners.map((el) => el.id) || [],
		tickets: props.offering?.tickets.map((el) => transformedTicket(el)) || [
			{
				name: '',
				description: '',
				price: 0,
				currency: 'usd',
				status: 'active',
			},
		],
		isActive: props.offering?.isActive || false,
		slug: props.offering?.slug || '',
		studioId: props.offering?.studio?.id || '65f9cb054cf3fa686ab8a90a',
	},
})

const [name] = defineField('name')
const [description] = defineField('description')
const [activity] = defineField('activity')
const [start] = defineField('start')
const [end] = defineField('end')
const [duration] = defineField('duration')
const [spots] = defineField('spots')
const [is_private] = defineField('is_private')
const [categories] = defineField('categories')
const [types] = defineField('types')
const [timezone] = defineField('timezone')
const [location] = defineField('location')
const [practitioners] = defineField('practitioners')
const [tickets] = defineField('tickets')

onBeforeMount(() => {
	const center = (location?: TMarker) => {
		if (!location) {
			return {
				center: [0, 0],
				id: '',
				place_name: '',
			}
		}
		return {
			center: [location.coords[1], location.coords[0]],
			id: location.name,
			place_name: location.name,
		}
	}
	_practitioners.value = props.offering?.practitioners || []
	_location.value = center(props.offering?.location)
	bannersUpdate.value =
		props.offering?.banners.map((el) => ({
			id: el.id || '',
			url: el.url,
		})) || []
})

const moduleImagesUploader = ref<any>(null)
const {
	bannersUpdate,
	bannersDelete,
	bannersOrder,
	bannersFiles,
	moduleImagesChange,
} = useBanners(props.updateData, props.offering?.banners)

const {
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
} = useLocation(location as Ref<TMarker | null>, props.updateData)

const { addEmptyTicket, removeTicket } = useTickets(tickets)

const { practitionersOptions, _practitioners, clearPractitioners } =
	usePractitioners(practitioners)

const resetFormHandler = () => {
	resetForm()
	resetLocation()
	moduleImagesUploader.value?.clearFiles()
	clearPractitioners()
}

const { createOffering, updateOffering } = useOffering()

// const onSubmit = () => {
// 	// alert(JSON.stringify(values, null, 2))
// 	const result = offeringDataCreationSchema.safeParse(values)
// 	if (!result.success) {
// 		console.log('result: ', result)
// 		console.log('result: ', result.error.format())
// 	}
// }

const onSubmit = handleSubmit((values) => {
	// alert(JSON.stringify(values, null, 2))

	if (props.updateData) {
		updateOfferingHandler(values)
	} else {
		createOfferingHandler(values)
	}
})

async function createOfferingHandler(values: TOfferingCreationData) {
	console.log({ ...values, banners: bannersFiles.value })
	// toast.success()
	return createOffering({ ...values, banners: bannersFiles.value })
		.then((res: any) => {
			console.log('res', res)
			resetFormHandler()
			toast.success(
				'Offering has been created successfully. Currently not active'
			)
			setTimeout(() => {
				toast.success('You will be redirected to the offering page')
			}, 2000)
			setTimeout(() => {
				router.push('/offering/' + res.data.slug)
			}, 4000)
		})
		.catch((error) => {
			console.log(error)
			toast.error(error)
		})
}

const updatePractitionersData = (
	practitioners: TPractitioner[],
	collectedPractitioners: any[]
) => {
	function getDifference(oldArray: string[], newArray: string[]) {
		return oldArray.filter((x) => !newArray.includes(x))
	}
	const oldPracs = practitioners.map((el) => el.id)
	const updatedPracs = collectedPractitioners.map((el) => el.id)
	const practitionersRemove = getDifference(oldPracs, updatedPracs)
	const newPracs = updatedPracs.filter(
		(el) => !oldPracs.some((_el) => _el === el)
	)

	return { practitionersRemove, newPracs }
}
const updateTicketsData = (
	oldTickets: TTicket[],
	collectedTickets: TTicketCreate[]
) => {
	function getDifference(oldArray: string[], newArray: string[]) {
		return oldArray.filter((x) => !newArray.includes(x))
	}
	const _oldTickets = oldTickets?.map((el) => el.id) || []
	const updatedTickets = collectedTickets.map((el) => el?.id || '')
	const newTickets: TTicketCreate[] = collectedTickets.filter((el) => !el.id)
	const ticketsRemove = getDifference(_oldTickets, updatedTickets)

	return {
		newTickets,
		ticketsRemove,
	}
}
async function updateOfferingHandler(values: TOfferingCreationData) {
	if (
		!props.offering?.id
		// || !props.studioId
	)
		return

	// Practitioners
	const { newPracs, practitionersRemove } = updatePractitionersData(
		props.offering.practitioners,
		_practitioners.value
	)

	// Tickets
	const { newTickets, ticketsRemove } = updateTicketsData(
		props.offering.tickets,
		tickets.value || []
	)

	console.log({
		...values,
		tickets: newTickets,
		ticketsRemove,
		practitioners: newPracs,
		practitionersRemove,
		banners: bannersFiles.value,
		bannersDelete: bannersDelete.value,
		bannersOrder: bannersOrder.value,

		offeringId: props.offering.id,
	})

	return updateOffering(
		{
			...values,
			tickets: newTickets,
			ticketsRemove,
			practitioners: newPracs,
			practitionersRemove,
			banners: bannersFiles.value,
			bannersDelete: bannersDelete.value,
			bannersOrder: bannersOrder.value,
		},
		props.offering.id
	)
		.then(() => {
			const pracsMsg = practitionersRemove.length
				? practitionersRemove.length + ' practitioner(s) removed.'
				: ''
			const ticketsMsg = ticketsRemove.length
				? ' ' + ticketsRemove.length + ' ticket(s) set inactive.'
				: ''
			const sumMsg = pracsMsg + ticketsMsg

			toast.success(`Offering data has been updated. ${sumMsg}`)
		})
		.catch((error: any) => {
			console.log(error)
			toast.error(error.message)
		})
}
</script>
