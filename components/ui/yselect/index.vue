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
				}"
				:value-prop="props.valueProp"
				:label="props.field"
				:canClear="props.canClear"
				:canDeselect="props.canDeselect"
				:hideSelected="false"
				:closeOnSelect="mode === 'multiple' ? false : true"
			/>
		</label>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Multiselect from '@vueform/multiselect'

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
}
const props = withDefaults(defineProps<IProps>(), {
	mode: 'single',
	canClear: false,
	canDeselect: false,
})
const emit = defineEmits(['update:model-value'])
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
