<template>
	<div class="flex flex-col gap-3">
		<LogoFile
			label="Logo"
			v-model:selectedFile="selectedFileLogo"
			v-model:imageUrl="logoImageUrl"
		/>
		<LogoFile
			label="Banner"
			variant="banner"
			v-model:selectedFile="selectedFileBanner"
			v-model:imageUrl="bannerImageUrl"
		/>
		<Input v-model="formData.name" label="Studio name" />
		<div class="flex gap-2">
			<Input v-model="formData.location" label="Studio location" />
			<Yselect
				v-model="formData.timezone"
				label="Timezone"
				:options="_timezones"
				searchable
				field="tzId"
				value-prop="tzId"
			/>
		</div>
		<Yselect
			v-model="formData.currency"
			label="Currency"
			:options="_currencies"
			field="name"
			value-prop="code"
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
		<!-- TODO: tags -->
		<!-- <Yselect label="Tags" /> -->
		<Textarea v-model="formData.bio" label="Bio" />
		<Textarea v-model="formData.mission" label="Mission" />
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
			:resolve-on-load="false"
			:delay="1500"
			:min-chars="1"
			openDirection="top"
		/>
		<Button @click="handleForm" class="self-start" :disabled="isButtonDisabled">
			<span class="font-semibold text-white">
				{{ updateData ? 'Update' : 'Create' }}
			</span>
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
import _randomStudioData from '~/helpers/randomStudioData.json'

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
			banner: bannerImageUrl.value,
			practitioners: formData.practitioners,
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
			logo: props.studio.logo ? props.studio.logo.url || '' : '',
			banner: props.studio.banner.length
				? props.studio.banner[0].url || ''
				: '',
			practitioners: props.studio.practitioners.map((el) => ({
				name: el.name,
				profileImage: el.profileImage,
				id: el.id,
			})),
		}
		const isEqualState = isEqual(currentFields, studioData)

		return isEqualState
	}
	return false
})

const { createStudio, updateStudio } = useStudio()
const selectedFileLogo = ref(null)
const logoImageUrl = ref<string | null>(null)
const selectedFileBanner = ref(null)
const bannerImageUrl = ref<string | null>(null)
const _timezones = timezones
const _currencies = currencies
const _categories = _data.categories
const _types = _data.types
const randomNames = _randomStudioData.names

const formData = reactive<{
	name: string
	location: string
	timezone: string
	currency: string
	categories: string[]
	types: string[]
	bio: string
	mission: string
	practitioners: {
		name: string
		profileImage: string
		id: string
	}[]
}>({
	name: '',
	location: '',
	timezone: _timezones[0].tzId,
	currency: _currencies[0].code,
	categories: [],
	types: [],
	bio: '',
	mission: '',
	practitioners: [],
})

watch(
	() => props.studio,
	(val) => {
		if (!val) return

		logoImageUrl.value = val.logo ? val.logo.url : ''
		bannerImageUrl.value = val.banner.length ? val.banner[0].url : ''

		loading.value = false
	}
)

onMounted(() => {
	if (!(props.studio && props.updateData)) {
		formData.name = randomNames[Math.floor(Math.random() * randomNames.length)]
	}
})
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
		logoImageUrl.value = props.studio.logo ? props.studio.logo.url : ''
		bannerImageUrl.value = props.studio.banner.length
			? props.studio.banner[0].url
			: ''
		formData.practitioners = props.studio.practitioners.map((el) => ({
			id: el.id,
			name: el.name || '',
			profileImage: el.profileImage || '',
		}))
	}
})

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
					banner: selectedFileBanner.value,
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
				banner: selectedFileBanner.value,
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

// Practitioners
async function loadUsers(query?: string) {
	if (!query?.trim()) return Promise.resolve([])

	const res = await $fetch<{ data: any }>('/api/users/search', {
		method: 'POST',
		body: {
			search: query.trim(),
		},
	})
	if (!res) return []
	return res.data
}
const practitionersOptions = async (query: string) => {
	return await loadUsers(query)
}
</script>
