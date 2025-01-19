<template>
	<div class="flex flex-col gap-2">
		<div class="relative">
			<LoadingIcon
				v-if="loading"
				class="fill-primary mx-auto absolute left-1/2 -translate-x-1/2 -top-3"
			/>
		</div>

		<div
			v-if="
				data &&
					!data.offerings.length &&
					!data.studios.length &&
					!data.practitioners.length
			"
			class="text-gray-500 font-semibold text-center text-xs"
		>
			Unfortunately, there is no result
		</div>

		<template v-if="data">
			<div v-show="data.offerings.length" class="flex flex-col gap-2`">
				<span class="text-gray-400 font-semibold text-xs px-2 mb-1">
					Offerings
				</span>
				<button
					v-for="offering of data.offerings"
					:key="offering.id"
					class="flex gap-3 hover:bg-gray-100/60 transition-colors text-left px-3 py-1.5 rounded-lg"
					@click="goTo(`/offering/${offering.slug}`)"
				>
					<NuxtImg
						:src="getImageUrl(offering)"
						class="w-8 h-6 rounded-md object-cover object-center mt-1"
						provider="cloudinary"
						width="100"
						height="auto"
						format="webp"
					/>
					<div class="flex flex-col gap-0">
						<p
							class="capitalize font-bold text-xs"
							:class="{
								'text-blue-500/90': offering.activity.toLowerCase() === 'class',
								'text-red-400': offering.activity.toLowerCase() === 'event',
								'text-yellow-500':
									offering.activity.toLowerCase() === 'appointment',
							}"
						>
							{{ offering.activity }}
						</p>
						<p class="font-semibold text-sm text-zinc-900">
							{{ offering.name }}
						</p>
						<div class="flex gap-1 text-xs">
							<div class="font-semibold text-gray-500 mb-1 text-nowrap">
								{{ dateString(offering.start, offering.end) }}
							</div>
							<span v-if="offering.location?.name" class="text-zinc-900">
								•
							</span>
							<div
								class="mb-1 truncate text-gray-600 font-semibold"
								:title="offering.location?.name || ''"
							>
								{{
									offering.location?.name
										? offering.location?.name.split(' ').slice(-2).join(' ')
										: ''
								}}
							</div>
						</div>
					</div>
				</button>
			</div>
			<div v-show="data.studios.length" class="flex flex-col gap-2`">
				<span class="text-gray-400 font-semibold text-xs px-2 mb-1">
					Studios
				</span>
				<button
					v-for="studio of data.studios"
					:key="studio.id"
					class="flex gap-3 hover:bg-gray-100/60 transition-colors text-left px-3 py-1.5 rounded-lg"
					@click="goTo(`/studio/${studio.slug}`)"
				>
					<NuxtImg
						v-if="studio.logo.url"
						:src="studio.logo.url || ''"
						class="w-8 h-8 rounded-full object-cover object-center mt-1"
						provider="cloudinary"
						width="32"
						height="32"
						format="webp"
					/>
					<div v-else class="w-8 h-8 rounded-full bg-gray-100"></div>
					<div class="flex flex-col gap-0">
						<p class="font-semibold text-sm text-zinc-900">{{ studio.name }}</p>
						<div class="flex gap-1 text-xs">
							<div
								class="mb-1 truncate text-gray-600 font-semibold"
								:title="studio.location?.name || ''"
							>
								{{
									studio.location?.name
										? studio.location?.name.split(' ').slice(-2).join(' ')
										: ''
								}}
							</div>
						</div>
					</div>
				</button>
			</div>
			<div v-show="data.practitioners.length" class="flex flex-col gap-2`">
				<span class="text-gray-400 font-semibold text-xs px-2 mb-1">
					Practitioners
				</span>
				<button
					v-for="practitioner of data.practitioners"
					:key="practitioner.id"
					class="flex gap-3 hover:bg-gray-100/60 transition-colors text-left px-3 py-1.5 rounded-lg items-center"
					@click="goTo(`/practitioner/${practitioner.id}`)"
				>
					<NuxtImg
						v-if="practitioner.profileImage"
						:src="practitioner.profileImage || ''"
						class="w-8 h-8 rounded-full object-cover object-center mt-1"
						provider="cloudinary"
						width="32"
						height="32"
						format="webp"
					/>
					<div v-else class="w-8 h-8 rounded-full bg-gray-100"></div>
					<div class="flex flex-col gap-0 items-center">
						<p class="font-semibold text-sm text-zinc-900">
							{{ practitioner.name }}
						</p>
					</div>
				</button>
			</div>
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { IShortSearchData } from '~/helpers/search/types'
import { dateString } from '~/lib/utils'

export default defineComponent({
	name: 'SearchList',
})
</script>
<script lang="ts" setup>
interface IProps {
	loading?: boolean
	data: IShortSearchData | null
}
defineProps<IProps>()
const router = useRouter()

function goTo(val: string) {
	router.push(val)
}
const getImageUrl = (offering: any) => {
	if (offering.banners && offering.banners[0]) {
		return offering.banners[0].url
	}

	return 'img/banner-placeholder2.jpeg'
}
</script>
