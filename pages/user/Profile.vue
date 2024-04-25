<template>
	<NuxtLayout name="user-admin">
		<div class="max-w-[600px]">
			<h1 class="pt-8 text-2xl font-bold mb-6">Edit profile</h1>
			<div class="flex flex-col gap-3">
				<LogoFile
					v-model:selectedFile="selectedFileAvatar"
					v-model:imageUrl="avatarUrl"
				/>
				<Input
					v-model="data.email"
					label="Your e-mail"
					placeholder="Your e-mail"
					type="email"
				/>
				<Input v-model="data.name" label="Your name" placeholder="Your name" />
				<Textarea v-model="data.bio" label="Your bio" placeholder="Your bio" />
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
import type { TUser } from '~/server/types'

export default defineComponent({
	name: 'ProfilePage',
})
</script>
<script lang="ts" setup>
definePageMeta({
	middleware: ['user'],
})
const { useAuthUser, updateProfile } = useAuth()

const selectedFileAvatar = ref<any>(null)
const avatarUrl = ref<string | null>(null)

const user = useAuthUser() as Ref<TUser>
const actionButtonDisabled = computed(() => {
	if (!user.value) return true
	const obj1 = { ...data }
	const obj2 = {
		name: user.value?.name || '',
		email: user.value?.email || '',
		bio: user.value?.bio || '',
	}
	const isAvatarChanged = avatarUrl.value !== user.value?.profileImage
	return isEqual(obj1, obj2) && !isAvatarChanged
})

const data = reactive({
	name: '',
	email: '',
	bio: '',
})

onMounted(() => {
	setData(user.value)
	avatarUrl.value = user.value?.profileImage || ''
})

watch(user, (val) => {
	if (val) setData(val)
})

function setData(val: any) {
	if (val) {
		data.name = val.name || ''
		data.email = val.email
		data.bio = val.bio || ''
		avatarUrl.value = user.value?.profileImage || ''
	}
}

function handleUpdateProfile() {
	updateProfile({
		...data,
		mediaFiles: {
			avatar: selectedFileAvatar.value,
		},
	})
		.then(() => {
			toast.success('Data has been updated')
		})
		.catch((error) => {
			setData(user.value)
			toast.error(error?.data?.statusMessage || 'Error occurred')
		})
}
</script>
