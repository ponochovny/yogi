<template>
	<div class="flex flex-col gap-3">
		<Input v-model="data.name" label="Studio name" />
		<Input v-model="data.location" label="Studio location" />
		<Yselect
			v-model="data.timezone"
			label="Timezone"
			:options="_timezones"
			field="tzId"
			value-prop="tzId"
		/>
		<Yselect
			v-model="data.currency"
			label="Currency"
			:options="_currencies"
			field="name"
			value-prop="code"
		/>
		<Yselect
			v-model="data.categories"
			label="Categories"
			:options="_categories"
			field="name"
			value-prop="name"
			mode="multiple"
		/>
		<Yselect
			v-model="data.types"
			label="Types"
			:options="_types"
			field="name"
			value-prop="name"
			mode="multiple"
		/>
		<!-- TODO: tags -->
		<!-- <Yselect label="Tags" /> -->
		<Textarea v-model="data.bio" label="Bio" />
		<Textarea v-model="data.mission" label="Mission" />
		<input
			type="file"
			ref="imageInput"
			hidden
			accept="image/png, image/gif, image/jpeg"
			@change="handleImageChange"
		/>
		<div @click="handleLogoChange">Set logo</div>
		<img
			v-if="inputImageUrl"
			:src="inputImageUrl"
			alt=""
			class="rounded-md w-auto max-h-48 self-start"
		/>
		<Button @click="handleStudioCreation" class="self-start">
			<span class="font-semibold text-white">Create</span>
		</Button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import timezones from '~/helpers/timeZones.json'
import currencies from '~/helpers/currencies.json'
import _data from '~/helpers/offeringAttributes.json'

export default defineComponent({
	name: 'Creation',
})
</script>
<script lang="ts" setup>
const { createStudio } = useStudio()
const imageInput = ref()
const selectedFileLogo = ref(null)
const inputImageUrl = ref(null)
const _timezones = timezones
const _currencies = currencies
const _categories = _data.categories
const _types = _data.types

const data = reactive({
	name: '',
	location: '',
	timezone: _timezones[0].tzId,
	currency: _currencies[0].code,
	categories: [_categories[0].name],
	types: [_types[0].name],
	bio: '',
	mission: '',
})

function handleLogoChange() {
	imageInput.value.click()
}

async function handleStudioCreation() {
	try {
		const response = await createStudio({
			...data,
			mediaFiles: {
				logo: selectedFileLogo.value,
				// banner: selectedFileBanner.value
			},
		})
	} catch (error) {
		console.log(error)
	}
}

// TODO: event type
function handleImageChange(event: any) {
	const file = event.target.files[0]

	selectedFileLogo.value = file

	const reader = new FileReader()

	reader.onload = (event: any) => {
		inputImageUrl.value = event.target.result
	}
	reader.readAsDataURL(file)
}
</script>
