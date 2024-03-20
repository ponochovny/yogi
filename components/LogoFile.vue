<template>
	<div class="flex flex-col gap-1">
		<span class="text-sm font-bold text-gray-700">Logo</span>
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
			<div
				v-else
				class="w-36 h-36 rounded-full bg-slate-100 flex items-center justify-center"
			>
				<ArrowDownTrayIcon class="w-7 text-gray-400" />
			</div>
		</div>
		<input
			type="file"
			ref="imageInput"
			hidden
			accept="image/png, image/gif, image/jpeg"
			@change="handleImageChange"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ArrowDownTrayIcon } from '@heroicons/vue/24/outline'

export default defineComponent({
	name: 'LogoFile',
})
</script>
<script lang="ts" setup>
interface IProps {
	logoImageUrl: string | null
	selectedFileLogo: any
}
const props = defineProps<IProps>()
const emit = defineEmits(['update:logoImageUrl', 'update:selectedFileLogo'])

const imageInput = ref()

function handleLogoChange() {
	imageInput.value.click()
}

// TODO: event type
function handleImageChange(event: any) {
	const file = event.target.files[0]

	// selectedFileLogo.value = file
	emit('update:selectedFileLogo', file)

	const reader = new FileReader()

	reader.onload = (event: any) => {
		// logoImageUrl.value = event.target.result
		emit('update:logoImageUrl', event.target.result)
	}
	reader.readAsDataURL(file)
}
</script>
