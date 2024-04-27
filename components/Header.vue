<template>
	<div
		class="flex items-center flex-row"
		:class="{
			'bg-white py-3 flex-col lg:flex-row md:gap-0 gap-3': variant === 'white',
		}"
	>
		<div
			class="flex w-full items-center"
			:class="{
				'md:flex-row flex-col': variant === 'white',
			}"
		>
			<NuxtLink
				to="/"
				class="shrink-0 w-[65px] transition duration-1000 ease-in bg-transparent rounded-full hover:bg-orange-200"
				:class="{
					'mb-4 md:mb-0': variant === 'white',
				}"
			>
				<NuxtImg src="/img/logo.svg" alt="Yogi app" width="65" height="65" />
			</NuxtLink>

			<slot name="left" />

			<div v-if="links" class="ml-3 sm:ml-[10%] hidden md:flex gap-3 sm:gap-8">
				<NuxtLink to="/search?location=Online">
					<span class="font-semibold">Explore live offerings</span>
				</NuxtLink>
				<NuxtLink to="/user/studio" v-if="user">
					<span class="font-semibold">Add your business</span>
				</NuxtLink>
			</div>
		</div>

		<div
			class="flex items-center gap-0 sm:gap-4 ml-auto shrink-0"
			:class="{ 'px-6 md:px-0': variant === 'white' }"
		>
			<NuxtLink v-if="user && !links" to="/user/studio" class="hidden sm:block">
				<span class="font-semibold">Add your business</span>
			</NuxtLink>

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
				<SelectContent
					class="mt-2 rounded-2xl shadow-md p-1.5 border border-gray-300/40"
				>
					<SelectItem
						v-for="currency of _currencies"
						:key="currency.code"
						:value="currency.code"
						class="hover:cursor-pointer transition-colors hover:bg-gray-100/60"
						title="Currency select"
					>
						{{ currency.code }}
					</SelectItem>
				</SelectContent>
			</Select>

			<!-- Cart status -->

			<template v-if="isAuthLoading">Loading...</template>
			<template v-else-if="!user">
				<NuxtLink to="/auth?t=register">
					<Button class="mr-2 sm:mr-0">
						<span class="text-base font-bold text-white">Sign up</span>
					</Button>
				</NuxtLink>
				<NuxtLink :to="loginLink()" class="font-semibold">Log in</NuxtLink>
			</template>
			<template v-else>
				<Popover>
					<PopoverTrigger>
						<div
							class="flex items-center gap-4 p-2 pr-3 rounded-full bg-white !text-black shadow-md hover:bg-orange-600 hover:!text-white transition-colors duration-500 border border-gray-300/40"
						>
							<NuxtImg
								provider="cloudinary"
								:src="user.profileImage || ''"
								:alt="user.name || ''"
								width="36"
								height="36"
								class="rounded-full w-9 h-9 object-cover"
								format="webp"
							/>
							<span class="font-semibold text-nowrap">
								{{ user?.name || user?.email }}
							</span>
						</div>
					</PopoverTrigger>
					<PopoverContent
						:align="'end'"
						:arrowPadding="0"
						class="mt-2 max-w-[200px] rounded-2xl shadow-md border border-gray-300/40"
					>
						<div class="flex flex-col gap-4 md:gap-2 w-full">
							<NuxtLink to="/user/profile"> My Profile </NuxtLink>

							<NuxtLink class="block md:hidden" to="/search?location=Online">
								Explore live offerings
							</NuxtLink>
							<NuxtLink class="block md:hidden" to="/user/studio" v-if="user">
								Add your business
							</NuxtLink>

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
import type { TUser } from '~/server/types'
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
interface IProps {
	links?: boolean
	variant?: 'white' | 'default'
}
withDefaults(defineProps<IProps>(), {
	links: true,
	variant: 'default',
})
const route = useRoute()
const { useAuthUser, useAuthLoading, logout } = useAuth()
const isAuthLoading = useAuthLoading()
const user = useAuthUser() as Ref<TUser>
const _currencies = currencies

const currencySelected = ref(_currencies[0].code)

function loginLink() {
	// @ts-ignore
	return '/auth?t=login' + '&redirect=' + route.href.substring(1)
}
</script>
