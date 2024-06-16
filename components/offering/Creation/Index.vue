<template>
	<div class="flex flex-col gap-3 lg:pr-0 pr-6 max-w-[600px]">
		<div>
			<pre class="text-xs">{{ values }}</pre>
			<pre class="text-xs">{{ errors }}</pre>
		</div>
		<form @submit.prevent="onSubmit" class="flex flex-col gap-4 py-4">
			<Input v-model="name" label="Offering name" placeholder="Offering name" />
			<div class="flex gap-2 flex-col sm:flex-row">
				<Datepicker v-if="start" label="Start" v-model="start" />
				<Datepicker v-if="end" label="End" v-model="end" />
			</div>
			<Yselect
				v-model="activity"
				label="Activity type"
				:options="['Class', 'Event', 'Appointment']"
			/>

			<div class="flex gap-3 sm:gap-2 flex-col sm:flex-row">
				<Input
					:modelValue="duration"
					@update:modelValue="duration = Number($event)"
					label="Offering duration"
					placeholder="Offering duration"
					type="number"
				/>
				<Input
					:modelValue="spots"
					@update:modelValue="spots = Number($event)"
					label="Offering spots"
					placeholder="Offering spots"
					type="number"
				/>
				<div class="flex space-x-2 sm:pb-3 self-end items-center mr-auto">
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
				<Yselect
					v-model="categories"
					label="Categories"
					:options="_categories"
					field="name"
					value-prop="name"
					mode="multiple"
				/>
				<Yselect
					v-model="types"
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
					v-model="_location"
					field="place_name"
					valueProp="id"
					object
					:options="features"
					placeholder="Find place on the map"
					:disabled="!features.length"
				/>
				<button
					v-if="_location?.place_name"
					@click="resetMarker(true)"
					class="flex items-center justify-center h-[42px] self-end rounded-md border border-gray-300 px-2 bg-white hover:bg-gray-100 shadow-sm mr-auto"
					title="Reset"
					type="button"
				>
					<ArrowPathIcon class="w-6 text-gray-600 stroke-1" />
				</button>
				<button
					@click="isShowMap = !isShowMap"
					class="flex items-center justify-center h-[42px] self-end rounded-md border border-gray-300 px-2 bg-white hover:bg-gray-100 shadow-sm mr-auto"
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
					:center="getCenter()"
					:sMarker="getMarkers()"
					:zoom="updateData ? 12 : 3"
					@features="setFeatures"
					@featureSelected="featureSelected"
					@markerRemoved="markerRemoved"
				/>
			</div>

			<!-- PRACTITIONERS SELECT -->
			<Yselect
				mode="tags"
				v-model="_practitioners"
				label="Practitioners"
				:options="practitionersOptions"
				object
				placeholder="Select practitioners"
				searchable
				field="name"
				value-prop="name"
			/>

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

			<ul class="text-rose-600">
				<li v-for="(error, key) in errors" :key="key">{{ error }}</li>
			</ul>

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
import { ArrowPathIcon, MapIcon } from '@heroicons/vue/24/outline'
import { toast } from 'vue-sonner'
import timezones from '~/helpers/timeZones.json'
import type { TMarker } from '~/helpers/types/map'
import useBanners from './helpers/useBanners'
import useLocation from './helpers/useLocation'
import usePractitioners from './helpers/usePractitioners'
import useTickets from './helpers/useTickets'

export default defineComponent({
	name: 'TestCreationForm',
})
</script>
<script lang="ts" setup>
const updateData = ref(false)
const _categories = _data.categories
const _types = _data.types
const _timezones = timezones
const { values, meta, errors, handleSubmit, resetForm, defineField } = useForm({
	validationSchema: offeringDataCreationSchemaTyped,
	initialValues: {
		name: '',
		start: new Date(),
		end: new Date(),
		activity: EActivity.CLASS,
		banners: [],
		duration: 0,
		description: '',
		spots: 0,
		is_private: false,
		categories: [],
		types: [],
		location: {
			coords: [0, 0],
			name: '',
		},
		timezone: _timezones[0].tzId,
		practitioners: [],
		tickets: [
			{
				name: '',
				description: '',
				price: 0,
				currency: 'usd',
				status: 'active',
			},
		],
		isActive: false,
		slug: '',
		studioId: '65f9cb054cf3fa686ab8a90a',
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

const moduleImagesUploader = ref<any>(null)
const {
	bannersUpdate,
	bannersDelete,
	bannersOrder,
	bannersFiles,
	moduleImagesChange,
} = useBanners(updateData.value)

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
} = useLocation(location as Ref<TMarker | null>, updateData.value)

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

	if (updateData.value) {
		// updateOfferingHandler()
	} else {
		createOfferingHandler(values)
	}
})

async function createOfferingHandler(values: TOfferingCreationData) {
	createOffering({ ...values, banners: bannersFiles.value })
		.then(() => {
			resetFormHandler()
			toast.success(
				'Offering has been created successfully. Currently not active'
			)
		})
		.catch((error) => {
			console.log(error)
			toast.error(error)
		})
}
// async function updateOfferingHandler() {
// 	if (!props.offering?.id) return

// 	const oldPracs = props.offering.practitioners.map((el) => el.id)
// 	const updatedPracs = formData.practitioners.map((el) => el.id)
// 	const practitionersRemove = getDifference(oldPracs, updatedPracs)
// 	const newPracs = updatedPracs.filter(
// 		(el) => !oldPracs.some((_el) => _el === el)
// 	)

// 	const oldTickets = props.offering.tickets?.map((el) => el.id) || []
// 	const updatedTickets = formData.tickets.map((el) => el?.id || '')
// 	const newTickets = formData.tickets.filter((el) => !el.id)
// 	const ticketsRemove = getDifference(oldTickets, updatedTickets)

// 	const deepCloned = useCloneDeep({
// 		...formData,
// 		name: formData.name,
// 		activity: formData.activity.toLowerCase() as
// 			| 'appointment'
// 			| 'class'
// 			| 'event',
// 		location: {
// 			coords: formData.location
// 				? [formData.location?.center[1], formData.location?.center[0]]
// 				: [],
// 			name: formData.location?.place_name || '',
// 		},
// 		duration: +formData.duration,
// 		spots: +formData.spots,
// 		start: new Date(formData.start),
// 		end: new Date(formData.end),
// 		bannersDelete: bannersDelete.value,
// 		bannersOrder: bannersOrder.value,
// 		banners: bannersFiles.value,
// 		studioId: isArray(studioId)
// 			? (studioId[0] as string)
// 			: (studioId as string),
// 		tickets: newTickets,
// 		ticketsRemove,
// 		practitioners: newPracs,
// 		practitionersRemove,
// 		isActive: props.offering.isActive,
// 	})
// 	updateOffering(deepCloned, props.offering.id)
// 		.then(() => {
// 			emit('updated')
// 			toast.success(
// 				`Offering data has been updated. ${
// 					practitionersRemove.length
// 						? practitionersRemove.length + ' practitioner(s) removed.'
// 						: ''
// 				} ${
// 					ticketsRemove.length
// 						? ticketsRemove.length + ' ticket(s) set inactive.'
// 						: ''
// 				}`
// 			)
// 		})
// 		.catch((error: any) => {
// 			console.log(error)
// 			toast.error('Error ocurred')
// 		})
// }
</script>
