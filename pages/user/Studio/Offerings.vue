<template>
	<NuxtLayout name="user-offering-settings">
		<div>
			<h1 class="pt-8 text-2xl font-bold mb-6">Offering creation</h1>
			<div class="flex flex-col gap-3 max-w-[600px]">
				<Input
					v-model="formData.name"
					label="Offering name"
					placeholder="Offering name"
				/>
				<Datepicker label="Start" v-model="formData.start" />
				<Datepicker label="End" v-model="formData.end" />
				<Yselect
					v-model="formData.activity"
					label="Activity type"
					:options="['Class', 'Event', 'Appointment']"
				/>
				<Input
					v-model="formData.duration"
					label="Offering duration"
					placeholder="Offering duration"
					type="number"
				/>
				<Textarea
					v-model="formData.description"
					label="Offering description"
					placeholder="Offering description"
				/>
				<Input
					v-model="formData.spots"
					label="Offering spots"
					placeholder="Offering spots"
					type="number"
				/>
				<div class="flex items-center space-x-2">
					<Switch
						id="airplane-mode"
						:checked="formData.is_private"
						@update:checked="formData.is_private = $event"
					/>
					<label for="airplane-mode">Private</label>
				</div>
				<Yselect
					v-model="formData.categories"
					label="Categories"
					:options="_categories"
					field="name"
					value-prop="name"
					mode="multiple"
				/>
				<Yselect
					v-model="formData.types"
					label="Types"
					:options="_types"
					field="name"
					value-prop="name"
					mode="multiple"
				/>
				<Input
					v-model="formData.location"
					label="Offering location"
					placeholder="Offering location"
				/>
				<Yselect
					v-model="formData.timezone"
					label="Timezone"
					:options="_timezones"
					searchable
					field="tzId"
					value-prop="tzId"
				/>
				<Button @click="createOfferingHandler" class="self-start">
					<span class="text-white font-semibold">Create</span>
				</Button>
			</div>
		</div>
	</NuxtLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import timezones from '~/helpers/timeZones.json'
import _data from '~/helpers/offeringAttributes.json'

export default defineComponent({
	name: 'UserStudioSettings',
})
</script>
<script lang="ts" setup>
const { createOffering } = useOffering()
const { useStudioSelected } = useAuth()
const _timezones = timezones
const _categories = _data.categories
const _types = _data.types

const formData = reactive<any>({
	name: '',
	start: new Date(),
	end: new Date(),
	activity: 'Class',
	duration: '',
	description: '',
	spots: '',
	is_private: false,
	categories: [],
	types: [],
	location: '',
	timezone: _timezones[0].tzId,
})

function createOfferingHandler() {
	const studioId = useStudioSelected()
	createOffering({
		...formData,
		studioId: studioId.value,
	})
}
</script>
