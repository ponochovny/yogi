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
</script>
