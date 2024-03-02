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
								:modelValue="user?.email || ''"
								label="Your e-mail"
								placeholder="Your e-mail"
								type="email"
							/>
							<Input
								:modelValue="user?.name || ''"
								label="Your name"
								placeholder="Your name"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { IUser } from '~/server/types'
import { userMenu } from '~/helpers/adminPanel'

export default defineComponent({
	name: 'ProfilePage',
})
</script>
<script lang="ts" setup>
const { useAuthUser } = useAuth()

const user = useAuthUser() as Ref<IUser>
const _userMenu = userMenu
</script>
