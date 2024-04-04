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
			<NuxtLink to="/user/studio" v-if="user">
				<span class="font-semibold">Add your business</span>
			</NuxtLink>
		</div>
		<div class="flex items-center gap-4 ml-auto">
			<Select v-model="currencySelected">
				<SelectTrigger
					class="inline-flex w-auto items-center justify-between rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-transparent text-grass11 border-none outline-none ring-0 focus:ring-0 focus:outline-none ring-offset-0 focus:ring-offset-0"
				>
					<div>
						<div class="flex items-center gap-2">
							<BanknotesIcon class="w-6 stroke-1" />
							<span class="font-semibold">{{ currencySelected }}</span>
						</div>
					</div>
				</SelectTrigger>
				<SelectContent class="mt-2 rounded-2xl border-0 shadow-md p-1.5">
					<SelectItem
						v-for="currency of _currencies"
						:key="currency.code"
						:value="currency.code"
					>
						{{ currency.code }}
					</SelectItem>
				</SelectContent>
			</Select>
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
						<div
							class="flex items-center gap-4 p-2 pr-3 rounded-full bg-white !text-black shadow-md hover:bg-orange-600 hover:!text-white transition-colors duration-500"
						>
							<img
								:src="user.profileImage || ''"
								:alt="user.name || ''"
								width="36"
								height="36"
								class="rounded-full w-9 h-9 object-cover"
							/>
							<span class="font-semibold">
								{{ user?.name || user?.email }}
							</span>
						</div>
					</PopoverTrigger>
					<PopoverContent
						align="end"
						:arrowPadding="0"
						class="mt-2 max-w-[200px] rounded-2xl border-0 shadow-md"
					>
						<div class="flex flex-col gap-2 w-full">
							<NuxtLink to="/user/profile"> My Profile </NuxtLink>

							<button @click="logout" class="text-left">Logout</button>
						</div>
					</PopoverContent>
				</Popover>
			</template>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { IUser } from '~/server/types'
import currencies from '~/helpers/currencies.json'
import { BanknotesIcon } from '@heroicons/vue/24/outline'

export default defineComponent({
	name: 'Header',
	components: {
		BanknotesIcon,
	},
})
</script>
<script lang="ts" setup>
const { useAuthUser, useAuthLoading, logout } = useAuth()
const isAuthLoading = useAuthLoading()
const user = useAuthUser() as Ref<IUser>
const _currencies = currencies

const currencySelected = ref(_currencies[0].code)
</script>
