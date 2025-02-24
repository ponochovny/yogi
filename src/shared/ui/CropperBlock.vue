<template>
	<div>
		<div class="relative">
			<cropper
				ref="cropperRef"
				:src="url"
				@ready="ready"
				:stencilComponent="
					stencilComponent === 'circle' ? CircleStencil : RectangleStencil
				"
				:stencilProps="stencilProps"
			/>
			<div
				v-if="isReady"
				class="flex h-[calc(100%_-_2rem)] gap-1 flex-wrap flex-col absolute left-2 top-2"
			>
				<button
					@click="reset"
					:disabled="!canReset"
					class="flex items-center justify-center w-8 h-8 rounded-full text-white bg-black/80 disabled:text-gray-600 disabled:opacity-60"
				>
					<History :size="18" :stroke-width="2" />
				</button>

				<button
					@click="flip(true, false)"
					class="flex items-center justify-center w-8 h-8 rounded-full text-white bg-black/80"
				>
					<FlipHorizontal :size="18" :stroke-width="2" />
				</button>

				<button
					@click="flip(false, true)"
					class="flex items-center justify-center w-8 h-8 rounded-full text-white bg-black/80"
				>
					<FlipVertical :size="18" :stroke-width="2" />
				</button>

				<button
					@click="rotate(90)"
					class="flex items-center justify-center w-8 h-8 rounded-full text-white bg-black/80"
				>
					<RotateCw :size="18" :stroke-width="2" />
				</button>

				<button
					@click="rotate(-90)"
					class="flex items-center justify-center w-8 h-8 rounded-full text-white bg-black/80"
				>
					<RotateCcw :size="18" :stroke-width="2" />
				</button>
				<button
					@click="download"
					class="flex items-center justify-center w-8 h-8 rounded-full text-white bg-black/80"
				>
					<Download :size="18" :stroke-width="2" />
				</button>
				<button
					@click="save"
					class="flex items-center justify-center w-8 h-8 rounded-full text-white bg-black/80"
				>
					<Save :size="18" :stroke-width="2" />
				</button>
			</div>
		</div>
		<slot name="footer" :save="save" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import 'vue-advanced-cropper/dist/theme.bubble.scss'
import { CircleStencil, RectangleStencil } from 'vue-advanced-cropper'
import {
	Download,
	FlipHorizontal,
	FlipVertical,
	History,
	RotateCcw,
	RotateCw,
	Save,
} from 'lucide-vue-next'

export default defineComponent({
	name: 'CropperBlock',
})
</script>
<script lang="ts" setup>
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

const emit = defineEmits(['file', 'reset'])
withDefaults(
	defineProps<{
		url: string
		stencilComponent?: 'circle' | 'rectangle'
		stencilProps?: object
		canReset?: boolean
	}>(),
	{
		stencilComponent: 'rectangle',
	}
)

const cropperRef = ref<any>(null)

const isReady = ref(false)
function ready() {
	isReady.value = true
}
// IMAGE MANIPULATIONS
function flip(x: boolean, y: boolean) {
	cropperRef.value.flip(x, y)
}
function rotate(angle: number) {
	cropperRef.value.rotate(angle)
}
function download() {
	const result = cropperRef.value.getResult().canvas.toDataURL()
	const newTab = window.open()
	if (newTab) {
		newTab.document.body.innerHTML = `<img src="${result}"></img>`
	}
}

function save() {
	if (!cropperRef.value) return

	const { canvas } = cropperRef.value.getResult()

	const formedImageFile = new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob: Blob) => {
				if (!blob) return reject('Some error occurred')

				const filename = crypto.randomUUID()
				const file = new File([blob], filename, { type: 'image/jpeg' })

				resolve(file)
			},
			'image/jpeg'
			// 0.8 // An image quality. (0-1)
		)
	})

	formedImageFile
		.then((file) => {
			emit('file', file)
		})
		.catch((e) => {})
}
function reset() {
	emit('reset')
}
</script>
<style lang="scss">
$base-color: rgb(235 168 84 / 95%);
$handler-size: 10px;
$hover-handler-size: 10px;
</style>
