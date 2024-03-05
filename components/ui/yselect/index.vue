<template>
	<div class="w-full">
		<label>
			<span v-if="props.label" class="text-sm font-bold text-gray-700">
				{{ props.label }}
			</span>
			<Multiselect
				:mode="props.mode"
				:value="props.modelValue"
				@update:model-value="emit('update:model-value', $event)"
				:options="props.options"
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
				}"
				:searchable="props.searchable"
				:value-prop="props.valueProp"
				:label="props.field"
				:canClear="props.canClear"
				:canDeselect="props.canDeselect"
				:hideSelected="false"
				:closeOnSelect="mode === 'multiple' ? false : true"
			>
				<template #option="{ option, isPointed, isSelected, search }: any">
					<div class="flex gap-2">
						<CheckIcon
							v-if="isSelected(option)"
							class="w-4"
							:class="{ 'text-orange-400': isSelected }"
						/>
						<span>{{ props.field ? option[props.field] : props.field }}</span>
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
	options?: any[]
	canClear?: boolean
	canDeselect?: boolean
	searchable?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
	mode: 'single',
	canClear: false,
	canDeselect: false,
	searchable: false,
})
const emit = defineEmits(['update:model-value'])
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
