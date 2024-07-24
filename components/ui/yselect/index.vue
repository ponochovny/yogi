<template>
	<div class="w-full flex flex-col gap-1">
		<label>
			<span v-if="label" class="text-sm font-bold text-gray-700">
				{{ label }}
			</span>
			<Multiselect
				ref="componentRef"
				:mode="mode"
				:value="modelValue"
				@update:model-value="emit('update:model-value', $event)"
				@close="emit('close')"
				:options="options"
				:classes="{
					container:
						variant === 'button'
							? 'flex relative border border-orange-600/30 bg-transparent text-orange-600 rounded-full hover:bg-orange-400/10 hover:text-orange-600 active:bg-orange-400/5 disabled:bg-transparent disabled:opacity-50 h-[40px] ring ring-orange-300/0 !transition'
							: 'multiselect !border-gray-300 !mt-1 !rounded-md',
					placeholder:
						variant === 'button'
							? 'w-full px-5 pb-0.5 absolute inset-0 flex items-center justify-center'
							: 'multiselect-placeholder',
					caret:
						variant === 'button'
							? 'multiselect-caret !bg-orange-600/50'
							: 'multiselect-caret',
					dropdown:
						variant === 'button'
							? 'multiselect-dropdown scrollbar !rounded-b-2xl !rounded-t-none !-bottom-[13px] !border-0 !border-t-[1px] !border-gray-200/80 !shadow-md scrollbar-thin'
							: 'multiselect-dropdown scrollbar',

					containerOpen:
						'_is-open border-orange-300 ring ring-orange-300 ring-opacity-50 !border-orange-300',
					containerActive:
						'_is-active border-orange-300 ring !ring-orange-300 !ring-opacity-50 !border-orange-300',
					optionPointed: 'bg-orange-400/10',
					optionSelected: '',
					optionSelectedPointed: 'bg-orange-400/10',
					search: 'multiselect-search focus:ring-0',
					tagsSearch:
						'multiselect-tags-search !ring-0 !border-b-2 !border-solid !border-transparent focus:!border-orange-400',
					tag: 'multiselect-tag !bg-orange-400',
				}"
				:placeholder="placeholder"
				:searchable="searchable"
				:value-prop="valueProp"
				:label="field"
				:canClear="canClear"
				:canDeselect="canDeselect"
				:hideSelected="false"
				:closeOnSelect="mode === 'multiple' || mode === 'tags' ? false : true"
				:object="object"
				:resolveOnLoad="resolveOnLoad"
				:delay="delay"
				:minChars="minChars"
				:openDirection="openDirection"
			>
				<template #option="{ option, isPointed, isSelected, search }: any">
					<div class="flex gap-2">
						<CheckIcon
							v-if="isSelected(option)"
							class="w-4"
							:class="{ 'text-orange-400': isSelected }"
						/>
						<span>{{ field ? option[field] : option.value }}</span>
					</div>
				</template>
				<template #tag="{ option, handleTagRemove, disabled }: any">
					<div
						class="multiselect-tag is-user !bg-orange-400 !py-1"
						:class="{
							'is-disabled': disabled,
						}"
					>
						<div class="flex gap-1 items-center">
							<img :src="option.profileImage" class="w-6 h-6 rounded-full" />
							<span>{{ option.name }}</span>
						</div>
						<span
							v-if="!disabled"
							class="multiselect-tag-remove"
							@click="handleTagRemove(option, $event)"
						>
							<span class="multiselect-tag-remove-icon"></span>
						</span>
					</div>
				</template>
				<template v-if="variant === 'button'" #multiplelabel="{ values }">
					<div class="flex gap-2 truncate pl-4 w-full pr-2 mb-0.5">
						<span
							v-for="(val, idx) of (values as any[])"
							:key="field ? val[field] : val"
						>
							{{ field ? val[field] : val
							}}{{ idx + 1 === (values as any[]).length ? '' : ',' }}
						</span>
					</div>
					<div v-if="(values as any[]).length > 1" class="mx-1">
						{{ '+' + ((values as any[]).length - 1) }}
					</div>
				</template>
			</Multiselect>
		</label>
		<p class="text-rose-600 text-xs pl-1" :class="{ hidden: !error }">
			{{ error }}
		</p>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Multiselect from '@vueform/multiselect'
import { CheckIcon } from '@heroicons/vue/24/outline'

export default defineComponent({
	name: 'Yselect',
	components: { Multiselect },
})
</script>
<script lang="ts" setup>
interface IProps {
	variant?: 'button'
	mode?: 'single' | 'multiple' | 'tags'
	modelValue: any
	label?: string
	field?: string
	valueProp?: string
	options?: object | Function | any[]
	canClear?: boolean
	canDeselect?: boolean
	searchable?: boolean
	object?: boolean
	// closeOnSelect?: boolean
	placeholder?: string
	resolveOnLoad?: boolean
	delay?: number
	minChars?: number
	openDirection?: 'bottom' | 'top'
	error?: string
}
const props = withDefaults(defineProps<IProps>(), {
	mode: 'single',
	canClear: false,
	canDeselect: false,
	searchable: false,
	object: false,
	// closeOnSelect: true,
	resolveOnLoad: true,
	delay: -1,
	minChars: 0,
	openDirection: 'bottom',
})
const emit = defineEmits(['update:model-value', 'close'])

const componentRef = ref<any>(null)
function open() {
	componentRef.value?.open()
}
function close() {
	componentRef.value?.close()
}

defineExpose({ open, close })
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
