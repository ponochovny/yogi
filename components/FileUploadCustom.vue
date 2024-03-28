<template>
	<div>
		<span v-if="props.label" class="text-sm font-bold text-gray-700">
			{{ props.label }}
		</span>

		<div v-if="uploaded?.length" class="border rounded-xl p-3 mb-2">
			<div
				v-for="(fileUrl, index) of uploaded as any[]"
				:key="fileUrl"
				class="relative w-24 h-24 shadow-lg border rounded-md mb-2"
			>
				<img
					role="presentation"
					:src="fileUrl"
					class="object-cover object-center w-full h-full rounded-md"
				/>
				<button
					class="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-orange-400 text-xs text-white"
					@click="onDeleteUploaded(fileUrl)"
				>
					<XMarkIcon class="w-3 stroke-[3px]" />
				</button>
			</div>
		</div>

		<div class="mt-1">
			<FileUpload
				name="demo[]"
				:multiple="true"
				accept="image/*"
				:maxFileSize="1000000"
				@select="onSelectedFiles"
				@remove="onRemove"
			>
				<template #header="{ chooseCallback, clearCallback, files }">
					<div
						class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2 mb-2"
					>
						<div class="flex gap-2">
							<Button @click="chooseCallback()" btnSize="sm">
								<span class="text-white font-semibold text-xs">+ Add</span>
							</Button>
							<Button
								@click="clearHandler(clearCallback)"
								:disabled="!files || files.length === 0"
								btnSize="sm"
							>
								<span class="text-white font-semibold text-xs">Clear</span>
							</Button>
						</div>
					</div>
				</template>
				<template
					#content="{
						files: contentFiles,
						uploadedFiles,
						removeUploadedFileCallback,
						removeFileCallback,
					}"
				>
					<div
						v-if="contentFiles.length > 0"
						class="py-2 flex gap-2 flex-wrap justify-content-center p-3 border rounded-xl text-gray-500"
					>
						<div
							v-for="(file, index) of contentFiles as any[]"
							:key="file.name + file.type + file.size"
							class="relative w-24 h-24 shadow-lg border rounded-md mb-2"
						>
							<img
								role="presentation"
								:alt="file.name"
								:src="file.objectURL"
								class="object-cover object-center w-full h-full rounded-md"
							/>
							<!-- <span class="font-semibold text-xs">{{ file.name }}</span> -->
							<div
								class="rounded-lg bg-black px-3 py-1 absolute left-0 right-0 -bottom-2 text-xs text-white w-auto max-w-[90%] ml-auto mr-auto text-center"
							>
								{{ formatSize(file.size) }}
							</div>
							<!-- Pending -->
							<button
								class="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-orange-400 text-xs text-white"
								@click="onRemoveTemplatingFile(file, removeFileCallback, index)"
							>
								<XMarkIcon class="w-3 stroke-[3px]" />
							</button>
						</div>
					</div>

					<div v-if="uploadedFiles.length > 0">
						<h5>Completed</h5>
						<div class="flex flex-wrap p-0 sm:p-5 gap-5">
							<div
								v-for="(file, index) of uploadedFiles as any[]"
								:key="file.name + file.type + file.size"
								class="m-0 px-6 flex flex-col border items-center gap-3"
							>
								<div class="">
									<img
										role="presentation"
										:alt="file.name"
										:src="file.objectURL"
										width="100"
										height="50"
									/>
								</div>
								<span class="font-semibold text-xs">{{ file.name }}</span>
								<div>{{ formatSize(file.size) }}</div>
								Completed
								<Button
									icon="pi pi-times"
									@click="removeUploadedFileCallback(index)"
									outlined
									rounded
									severity="danger"
								/>
							</div>
						</div>
					</div>
				</template>
				<template #empty>
					<div
						class="flex justify-content-center p-3 border rounded-xl text-gray-500 border-dashed"
					>
						<p>Drag and drop files here to upload.</p>
					</div>
				</template>
			</FileUpload>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePrimeVue } from 'primevue/config'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface IProps {
	files: any[]
	uploaded?: string[]
	label?: string
}
const props = defineProps<IProps>()
const emit = defineEmits(['update:files', 'delete'])

const $primevue = usePrimeVue()

const totalSize = ref(0)
const totalSizePercent = ref(0)

const onRemoveTemplatingFile = (
	file: any,
	removeFileCallback: any,
	index: number
) => {
	removeFileCallback(index)
	totalSize.value -= parseInt(formatSize(file.size))
	totalSizePercent.value = totalSize.value / 10
}

const onSelectedFiles = (event: any) => {
	emit('update:files', event.files)
	event.files.forEach((file: any) => {
		totalSize.value += parseInt(formatSize(file.size))
	})
}

const onRemove = ({ files }: any) => {
	emit('update:files', files)
}

const formatSize = (bytes: any) => {
	const k = 1024
	const dm = 0
	// @ts-ignore
	const sizes = $primevue.config.locale.fileSizeTypes

	if (bytes === 0) {
		return `0 ${sizes[0]}`
	}

	const i = Math.floor(Math.log(bytes) / Math.log(k))
	const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm))

	return `${formattedSize} ${sizes[i]}`
}
function clearHandler(clearCallback: any) {
	clearCallback()
	emit('update:files', [])
}
function onDeleteUploaded(url: string) {
	emit('delete', url)
}
</script>
<style>
.p-fileupload > input[type='file'],
.p-fileupload-basic input[type='file'] {
	display: none;
}
</style>
