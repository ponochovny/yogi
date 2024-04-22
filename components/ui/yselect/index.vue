<template>
	<div class="w-full">
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
					container: 'multiselect !border-gray-300 !mt-1 !rounded-md',
					containerOpen:
						'_is-open border-orange-300 ring ring-orange-300 ring-opacity-50 !border-orange-300',
					containerActive:
						'_is-active border-orange-300 ring ring-orange-300 ring-opacity-50 !border-orange-300',
					optionPointed: 'bg-orange-400/10',
					optionSelected: '',
					optionSelectedPointed: 'bg-orange-400/10',
					search: 'multiselect-search focus:ring-0',
					dropdown: 'multiselect-dropdown scrollbar',
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
			</Multiselect>
		</label>
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
