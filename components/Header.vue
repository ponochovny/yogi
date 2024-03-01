<template>
	<div class="flex items-center">
		<NuxtLink
			to="/"
			class="transition duration-1000 ease-in bg-transparent rounded-full hover:bg-orange-200"
		>
			<img src="/img/logo.svg" alt="Yogi app" width="65" />
		</NuxtLink>
		<div class="ml-[10%] flex gap-8">
			<NuxtLink to="/">
				<span class="font-semibold">Explore live offerings</span>
			</NuxtLink>
			<NuxtLink to="/">
				<span class="font-semibold">Add your business</span>
			</NuxtLink>
		</div>
		<div class="flex items-center gap-4 ml-auto">
			<!-- Currency Select -->
			<!-- Cart status -->

			<template v-if="isAuthLoading">Loading...</template>

			<template v-else-if="!user">
				<NuxtLink to="/auth?t=register">
					<Button>
						<span class="text-base font-bold text-white">Sign up</span>
					</Button>
				</NuxtLink>
				<NuxtLink to="/auth?t=login" class="font-semibold">Log in</NuxtLink>
			</template>

			<template v-else>
				<Popover>
					<PopoverTrigger>
						<div class="flex items-center gap-2">
							<img
								:src="user.profileImage || ''"
								:alt="user.name || ''"
								width="36"
								class="rounded-full"
							/>
							<span class="font-semibold">
								{{ user?.email }}
							</span>
						</div>
					</PopoverTrigger>
					<PopoverContent align="end" :arrowPadding="0" class="mt-2">
						<button @click="logout">Logout</button>
					</PopoverContent>
				</Popover>
			</template>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { IUser } from '~/server/types'

export default defineComponent({
	name: 'Header',
})
</script>
<script lang="ts" setup>
const { useAuthUser, useAuthLoading, logout } = useAuth()
const isAuthLoading = useAuthLoading()
const user = useAuthUser() as Ref<IUser>
</script>
