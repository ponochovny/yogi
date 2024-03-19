<template>
	<NuxtLayout name="user-admin">
		<div class="max-w-[600px]">
			<h1 class="pt-8 text-2xl font-bold mb-6">Interests</h1>
			<div class="flex flex-col gap-8">
				<div class="flex flex-col gap-3">
					<span class="text-sm font-bold text-gray-700">
						Choose categories you’re interested in
					</span>
					<div class="flex gap-2 flex-wrap">
						<button
							v-for="category of _data.categories"
							:key="category.name"
							class="px-4 py-2 rounded-full border"
							:class="[updatedData.categories.find((el: string) => el === category.name) ? 'bg-orange-400 !text-white' : 'bg-white']"
							@click="setUpdatedData('categories', category.name)"
						>
							{{ category.name }}
						</button>
					</div>
				</div>
				<div class="flex flex-col gap-3">
					<span class="text-sm font-bold text-gray-700">
						Choose offering types you’re interested in
					</span>
					<div class="flex gap-2 flex-wrap">
						<button
							v-for="type of _data.types"
							:key="type.name"
							class="px-4 py-2 rounded-full border"
							:class="[updatedData.types.find((el: string) => el === type.name) ? 'bg-orange-400 !text-white':'bg-white']"
							@click="setUpdatedData('types', type.name)"
						>
							{{ type.name }}
						</button>
					</div>
					<Button
						class="self-start"
						@click="handleUpdateProfile"
						:disabled="actionButtonDisabled"
					>
						<span class="text-white font-bold">Update</span>
					</Button>
				</div>
			</div>
		</div>
	</NuxtLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import data from '~/helpers/offeringAttributes.json'
import type { IUser } from '~/server/types'
import { toast } from 'vue-sonner'

export default defineComponent({
	name: 'InterestsPage',
})
</script>
<script lang="ts" setup>
definePageMeta({
	middleware: ['user'],
})
const { useAuthUser, updateProfile } = useAuth()

const user = useAuthUser() as Ref<IUser>
const _data = data

const updatedData = reactive<any>({
	categories: [],
	types: [],
})
const actionButtonDisabled = computed(() => {
	if (!user.value) return true
	const obj1 = {
		interestsCategory: updatedData.categories.sort() || [],
		interestsType: updatedData.types.sort() || [],
	}
	const obj2 = {
		interestsCategory: user.value?.interestsCategory.sort() || [],
		interestsType: user.value?.interestsType.sort() || [],
	}
	return isEqual(obj1, obj2)
})
function setUpdatedData(type: 'categories' | 'types', val: string) {
	const idx = updatedData[type].findIndex((el: string) => el === val)
	const exists = idx > -1
	if (exists) {
		updatedData[type].splice(idx, 1)
	} else {
		updatedData[type].push(val)
	}
}
setData(user.value)

watch(user, (val) => {
	if (val) setData(val)
})
function setData(val: IUser) {
	if (val) {
		updatedData.categories = [...val.interestsCategory]
		updatedData.types = [...val.interestsType]
	}
}
function handleUpdateProfile() {
	updateProfile({
		interestsCategory: updatedData.categories,
		interestsType: updatedData.types,
	})
		.then(() => {
			toast.success('Data has been updated')
		})
		.catch((error) => {
			setData(user.value)
			toast.error(error.data.statusMessage)
		})
}
</script>
