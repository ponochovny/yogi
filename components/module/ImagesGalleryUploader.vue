<template>
	<div>
		<div>
			<div class="flex gap-1 flex-wrap mb-4">
				<Button @click="triggerFileInput" variant="primaryOutline" btnSize="sm">
					Choose Files
				</Button>
				<Button
					@click="clearFiles"
					variant="primaryOutline"
					:disabled="!filesData.length"
					btnSize="sm"
				>
					Clear
				</Button>
			</div>
			<input
				ref="fileInput"
				@change="handleFiles"
				type="file"
				:accept="props.format.map((item) => `.${item}`).join(', ')"
				multiple
				class="hidden"
			/>
			<div
				v-if="!filesData.length"
				ref="dropZoneRef"
				class="p-6 rounded-xl border shadow-md mb-6 transition-colors -mt-2"
				:class="{ 'bg-yellow-100/50': isOverDropZone }"
			>
				Drop images here
			</div>
			<div class="flex flex-wrap gap-2">
				<div
					v-for="(file, idx) in filesData"
					:key="idx"
					class="relative w-[100px] h-[100px] bg-black-200/10 border rounded-md shadow-sm"
					draggable
					@dragstart="startDrag($event, idx)"
					@drop.prevent="dropDragged($event, idx)"
					@dragover.prevent
					@dragenter.prevent
				>
					<div class="absolute -right-1 -top-1 flex flex-col gap-0.5">
						<button
							@click="removeFile(idx)"
							class="bg-gray-400 rounded-full w-6 h-6 shadow-sm flex items-center justify-center text-gray-100 text-xs z-10 hover:text-gray-100 hover:bg-gray-400/60"
						>
							<TrashIcon class="w-4 stroke-2" />
						</button>
						<button
							@click="cropFile(idx)"
							class="bg-gray-400 rounded-full w-6 h-6 shadow-sm flex items-center justify-center text-gray-100 text-xs z-10 hover:text-gray-100 hover:bg-gray-400/60"
						>
							<ViewfinderCircleIcon class="w-4 stroke-2" />
						</button>
					</div>
					<img
						:src="file.cropped.preview || file.preview"
						:title="`${file.name} (${formatBytes(file.size, 1)})`"
						class="w-full h-full object-cover object-center rounded-md"
					/>
				</div>
			</div>
		</div>
		<Dialog v-model:open="openCropper">
			<DialogContent
				class="w-[calc(600px_+_3.1rem)] max-w-none max-h-screen overflow-y-auto"
			>
				<DialogHeader>
					<DialogTitle>Crop image</DialogTitle>
					<DialogDescription>
						Make changes to image here. Click crop when you're done.
					</DialogDescription>
				</DialogHeader>
				<CropperBlock
					class="w-[600px]"
					:url="selectedCropFile.url"
					@file="handleCroppedFile"
					@reset="handleResetCroppedFile"
					:canReset="!!filesData[selectedCropFile.idx]?.cropped.file"
					:stencilComponent="stencilComponent"
					:stencilProps="stencilProps"
				>
					<template #footer="{ save }">
						<Button @click="save" variant="primary" class="mt-1 mx-auto">
							Crop
						</Button>
					</template>
				</CropperBlock>
			</DialogContent>
		</Dialog>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useDropZone } from '@vueuse/core'
import { TrashIcon, ViewfinderCircleIcon } from '@heroicons/vue/24/outline'
import { formatBytes } from '@/helpers'

export default defineComponent({
	name: 'ImagesGalleryUploader',
})
</script>
<script lang="ts" setup>
const props = withDefaults(
	defineProps<{
		data?: { id: string; url: string }[]
		format?: (
			| 'png'
			| 'jpg'
			| 'jpeg'
			| 'gif'
			| 'webp'
			| 'avif'
			| 'tiff'
			| 'bmp'
			| 'svg'
			| 'webp'
		)[]
		stencilComponent?: 'circle' | 'rectangle'
		stencilProps?: object
	}>(),
	{
		format: () => ['jpeg', 'jpg', 'png', 'webp'],
	}
)
const emit = defineEmits<{
	(
		e: 'change',
		data: {
			id: string | null
			file: File
		}[]
	): void
}>()

onMounted(() => {
	if (props.data) {
		props.data.forEach((item) => {
			filesData.value.push({
				id: item.id,
				name: '',
				size: 0,
				type: '',
				file: null,
				preview: item.url,
				cropped: {
					preview: item.url,
					file: null,
				},
			})
		})
	}
})

const filesData = ref<
	{
		id: string | null
		name: string
		size: number
		type: string
		file: File | null
		preview: string
		cropped: {
			preview: string
			file: File | null
		}
	}[]
>([])

function emitData() {
	const exportData = filesData.value.map((fileData) => ({
		id: fileData.id || null,
		file: fileData.cropped.file || (fileData.file as File),
	}))

	emit('change', exportData)
}

const dropZoneRef = ref<HTMLDivElement>()

function onDrop(files: File[] | null) {
	if (!files) return

	const newFilesData = files.map((file) => ({
		id: null,
		name: file.name,
		size: file.size,
		type: file.type,
		file: file,
		preview: '',
		cropped: {
			preview: '',
			file: null,
		},
	}))

	filesData.value = filesData.value.concat(newFilesData)

	newFilesData.forEach((fileData, index) => {
		previewFile(fileData.file, (result) => {
			filesData.value[
				filesData.value.length - newFilesData.length + index
			].preview = result
		})
	})

	function previewFile(file: File, callback: (result: string) => void) {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onloadend = () => {
			if (!reader.result) return
			callback(reader.result.toString())
		}
	}

	emitData()
}

const { isOverDropZone } = useDropZone(dropZoneRef, {
	onDrop,
	dataTypes: props.format.map((item) => `image/${item}`),
})

function removeFile(idx: number) {
	filesData.value.splice(idx, 1)

	emitData()
}

// DRAGGABLE
function startDrag(evt: any, idx: number) {
	evt.dataTransfer.dropEffect = 'move'
	evt.dataTransfer.effectAllowed = 'move'
	evt.dataTransfer.setData('itemID', idx)
}
function dropDragged(ev: any, idx: number) {
	const to = idx
	const from = ev.dataTransfer.getData('itemID')

	const tempFilesData = filesData.value
	const element = tempFilesData[from]

	tempFilesData.splice(from, 1)
	tempFilesData.splice(to, 0, element)

	filesData.value = tempFilesData

	//
	selectedCropFile.value.idx = to

	//
	emitData()
}

// Input button
const fileInput = ref<HTMLInputElement | null>(null)
function triggerFileInput() {
	fileInput.value?.click()
}
function clearFiles() {
	filesData.value = []

	emitData()
}
function handleFiles(event: any) {
	const files = event.target.files as File[]
	const fileArray = Array.from(files)
	onDrop(fileArray)
}

// CROP
const openCropper = ref(false)

const selectedCropFile = ref({
	idx: -1,
	url: '',
})

function cropFile(idx: number) {
	openCropper.value = true

	selectedCropFile.value = {
		idx,
		url: filesData.value[idx].cropped.preview || filesData.value[idx].preview,
	}
}
function handleCroppedFile(file: File) {
	const idx = selectedCropFile.value.idx
	filesData.value[idx] = {
		...filesData.value[idx],
		name: file.name,
		size: file.size,
		type: file.type,
		cropped: {
			preview: URL.createObjectURL(file),
			file: file,
		},
	}

	// Clear SelectedCropFile
	selectedCropFile.value = {
		idx: -1,
		url: '',
	}

	//
	openCropper.value = false

	//
	emitData()
}
function handleResetCroppedFile() {
	const idx = selectedCropFile.value.idx
	const originalFile = filesData.value[idx].file as File
	filesData.value[idx] = {
		id: null,
		name: originalFile.name,
		size: originalFile.size,
		type: originalFile.type,
		file: originalFile,
		preview: URL.createObjectURL(originalFile),
		cropped: {
			preview: '',
			file: null,
		},
	}
	selectedCropFile.value = {
		idx: selectedCropFile.value.idx,
		url: URL.createObjectURL(originalFile),
	}

	emitData()
}
</script>
