<template>
	<div class="max-w-screen-xl pt-3 mx-auto">
		<Header />
		<div class="pt-10">
			<div class="bg-white rounded-md flex">
				<div class="pr-10 w-full max-w-[200px]">
					<AdminSidebar :menu-items="_userMenu" />
				</div>
				<div class="pl-10 border-l pb-10 w-full max-w-[600px]">
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
										class="px-4 py-2 rounded-full border"
										:class="[updatedData.categories.find((el: string) => el === category.name) ? 'bg-orange-300 !text-white' : 'bg-white']"
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
										class="px-4 py-2 rounded-full border"
										:class="[updatedData.types.find((el: string) => el === type.name) ? 'bg-orange-300 !text-white':'bg-white']"
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
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { userMenu } from '~/helpers/adminPanel'
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
const _userMenu = userMenu
const _data = data

const updatedData = reactive<any>({
	categories: [],
	types: [],
})
const actionButtonDisabled = computed(() => {
	if (!user.value) return true
	const obj1 = {
		interestsCategory: updatedData.categories || [],
		interestsType: updatedData.types || [],
	}
	const obj2 = {
		interestsCategory: user.value?.interestsCategory || [],
		interestsType: user.value?.interestsType || [],
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
