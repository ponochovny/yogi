<template>
	<div>
		<input
			type="file"
			ref="fileInput"
			hidden
			accept="image/png, image/gif, image/jpeg"
			@change="handleFileChange"
		/>
		<div
			@click="handleFileChangeClick"
			class="cursor-pointer hover:opacity-75 transition-opacity duration-200 ease-in"
		>
			<div v-if="fileUrl" class="flex gap-1 flex-wrap">
				<img
					:src="fileUrl"
					class="object-cover object-center w-24 sm:w-36 h-24 sm:h-36 rounded-full"
				/>
			</div>
			<div
				v-else
				class="w-24 sm:w-36 h-24 sm:h-36 rounded-full bg-slate-100"
			></div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'SingleFileUploader',
})
</script>
<script lang="ts" setup>
const emit = defineEmits(['file'])
const fileInput = ref()
const selectedFile = ref<any>(null)
const fileUrl = ref<string>('')
function handleFileChangeClick() {
	fileInput.value.click()
}
function handleFileChange(event: any) {
	// Set file
	const file = event.target.files[0]

	selectedFile.value = event.target.files

	// Set preview url
	const reader = new FileReader()

	reader.onload = (event: any) => {
		fileUrl.value = event.target.result
	}
	reader.readAsDataURL(file)
}
watch(
	() => selectedFile.value,
	(val) => emit('file', val)
)
</script>
