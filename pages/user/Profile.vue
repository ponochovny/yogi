<template>
	<NuxtLayout name="user-admin">
		<div class="max-w-[600px]">
			<h1 class="pt-8 text-2xl font-bold mb-6">Edit profile</h1>
			<div class="flex flex-col gap-3">
				<div class="flex flex-col gap-2">
					<span class="text-sm font-bold text-gray-700">Photo</span>
					<img
						:src="user?.profileImage || ''"
						:alt="user?.name || ''"
						width="100"
						height="100"
						class="rounded-full"
					/>
				</div>
				<Input
					v-model="data.email"
					label="Your e-mail"
					placeholder="Your e-mail"
					type="email"
				/>
				<Input v-model="data.name" label="Your name" placeholder="Your name" />
				<Button
					class="self-start"
					@click="handleUpdateProfile"
					:disabled="actionButtonDisabled"
				>
					<span class="text-white font-bold">Update</span>
				</Button>
			</div>
		</div>
	</NuxtLayout>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import { toast } from 'vue-sonner'
import type { IUser } from '~/server/types'

export default defineComponent({
	name: 'ProfilePage',
})
</script>
<script lang="ts" setup>
definePageMeta({
	middleware: ['user'],
})
const { useAuthUser, updateProfile } = useAuth()

const user = useAuthUser() as Ref<IUser>
const actionButtonDisabled = computed(() => {
	if (!user.value) return true
	const obj1 = { ...data }
	const obj2 = {
		name: user.value?.name || '',
		email: user.value?.email || '',
	}
	return isEqual(obj1, obj2)
})

const data = reactive({
	name: '',
	email: '',
})

setData(user.value)

watch(user, (val) => {
	if (val) setData(val)
})

function setData(val: any) {
	if (val) {
		data.name = val.name || ''
		data.email = val.email
	}
}

function handleUpdateProfile() {
	updateProfile(data)
		.then(() => {
			toast.success('Data has been updated')
		})
		.catch((error) => {
			setData(user.value)
			toast.error(error.data.statusMessage)
		})
}
</script>
