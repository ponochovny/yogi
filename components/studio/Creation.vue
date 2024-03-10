<template>
	<div class="flex flex-col gap-3">
		<span class="font-bold">Logo</span>
		<div
			@click="handleLogoChange"
			class="self-start cursor-pointer hover:opacity-75 transition-opacity duration-200 ease-in"
		>
			<img
				v-if="logoImageUrl"
				:src="logoImageUrl"
				alt="Studio logo"
				class="object-cover object-center w-36 h-36 rounded-full"
			/>
			<div v-else class="w-36 h-36 rounded-full bg-slate-100"></div>
		</div>
		<Input v-model="formData.name" label="Studio name" />
		<Input v-model="formData.location" label="Studio location" />
		<Yselect
			v-model="formData.timezone"
			label="Timezone"
			:options="_timezones"
			searchable
			field="tzId"
			value-prop="tzId"
		/>
		<Yselect
			v-model="formData.currency"
			label="Currency"
			:options="_currencies"
			field="name"
			value-prop="code"
		/>
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
		<!-- TODO: tags -->
		<!-- <Yselect label="Tags" /> -->
		<Textarea v-model="formData.bio" label="Bio" />
		<Textarea v-model="formData.mission" label="Mission" />
		<input
			type="file"
			ref="imageInput"
			hidden
			accept="image/png, image/gif, image/jpeg"
			@change="handleImageChange"
		/>
		<Button @click="handleForm" class="self-start" :disabled="isButtonDisabled">
			<span class="font-semibold text-white">{{
				updateData ? 'Update' : 'Create'
			}}</span>
		</Button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import timezones from '~/helpers/timeZones.json'
import currencies from '~/helpers/currencies.json'
import _data from '~/helpers/offeringAttributes.json'
import type { IStudio } from '~/helpers/types/studio'
import { toast } from 'vue-sonner'

export default defineComponent({
	name: 'Creation',
})
</script>
<script lang="ts" setup>
interface IProps {
	updateData?: boolean
	studio?: IStudio
}
const props = withDefaults(defineProps<IProps>(), {
	updateData: false,
})
const emit = defineEmits(['updated'])

const loading = ref(false)

const isButtonDisabled = computed(() => {
	if (loading.value) return true
	if (props.updateData && props.studio) {
		const currentFields = {
			name: formData.name,
			location: formData.location,
			timezone: formData.timezone,
			currency: formData.currency,
			categories: formData.categories,
			types: formData.types,
			bio: formData.bio,
			mission: formData.mission,
			logo: logoImageUrl.value,
		}
		const studioData = {
			name: props.studio.name,
			location: props.studio.location[0],
			timezone: props.studio.timezone,
			currency: props.studio.currency,
			categories: props.studio.categories,
			types: props.studio.types,
			bio: props.studio.bio,
			mission: props.studio.mission,
			logo: props.studio.logo.length ? props.studio.logo[0].url || '' : '',
		}
		const isEqualState = isEqual(currentFields, studioData)

		return isEqualState
	}
	return false
})

const { createStudio, updateStudio } = useStudio()
const imageInput = ref()
const selectedFileLogo = ref(null)
const logoImageUrl = ref<string | null>(null)
const _timezones = timezones
const _currencies = currencies
const _categories = _data.categories
const _types = _data.types

const formData = reactive<{
	name: string
	location: string
	timezone: string
	currency: string
	categories: string[]
	types: string[]
	bio: string
	mission: string
}>({
	name: '',
	location: '',
	timezone: _timezones[0].tzId,
	currency: _currencies[0].code,
	categories: [],
	types: [],
	bio: '',
	mission: '',
})

watch(
	() => props.studio,
	(val) => {
		if (!val) return

		logoImageUrl.value = val.logo.length ? val.logo[0].url : ''

		loading.value = false
	}
)

onBeforeMount(() => {
	if (props.studio && props.updateData) {
		formData.name = props.studio.name
		formData.location = props.studio.location.length
			? props.studio.location[0]
			: ''
		formData.timezone = props.studio.timezone
		formData.currency = props.studio.currency
		formData.categories = props.studio.categories
		formData.types = props.studio.types
		formData.bio = props.studio.bio
		formData.mission = props.studio.mission
		logoImageUrl.value = props.studio.logo.length
			? props.studio.logo[0].url
			: ''
	}
})

function handleLogoChange() {
	imageInput.value.click()
}

// TODO: event type
function handleImageChange(event: any) {
	const file = event.target.files[0]

	selectedFileLogo.value = file

	const reader = new FileReader()

	reader.onload = (event: any) => {
		logoImageUrl.value = event.target.result
	}
	reader.readAsDataURL(file)
}

function handleForm() {
	if (props.updateData) {
		updateStudioHandler()
	} else {
		createStudioHandler()
	}
}

async function updateStudioHandler() {
	try {
		loading.value = true
		await updateStudio(
			{
				...formData,
				mediaFiles: {
					logo: selectedFileLogo.value,
					// banner: selectedFileBanner.value
				},
			},
			props.studio?.id as string
		)
		emit('updated')
		toast.success('Studio data has been updated')
	} catch (error) {
		console.log(error)
		toast.error('Error ocurred')
	}
}

async function createStudioHandler() {
	try {
		loading.value = true
		await createStudio({
			...formData,
			mediaFiles: {
				logo: selectedFileLogo.value,
				// banner: selectedFileBanner.value
			},
		})
		emit('updated')
		toast.success('Studio has been created successfully')
		// TODO: reset fields
	} catch (error) {
		console.log(error)
		toast.error('Error ocurred')
	} finally {
		loading.value = false
	}
}
</script>
