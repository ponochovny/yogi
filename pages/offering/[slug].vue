<template>
	<MainContainer>
		<template v-if="offeringData">
			<div class="flex flex-col gap-3 mt-14 mb-10">
				<div class="flex gap-1 text-sm">
					<div class="flex gap-1 text-xs font-semibold">
						<span
							class="text-green-700"
							:class="activityColorClass(offeringData?.data.activity)"
						>
							{{ offeringData?.data.activity }}
						</span>
						<span> • </span>
					</div>
					<div class="flex flex-wrap">
						<span
							v-for="cat of offeringData?.data.categories"
							:key="cat"
							class="text-xs mr-1"
						>
							{{ cat }}
						</span>
					</div>
				</div>
				<div class="text-3xl font-semibold">{{ offeringData?.data.name }}</div>
				<div class="flex gap-4 items-center">
					<div class="flex gap-2 items-center">
						<CalendarIcon class="w-5 text-orange-500 stroke-1.5" />
						<span class="font-semibold text-sm">
							{{ dateString(offeringData?.data.start, offeringData?.data.end) }}
						</span>
					</div>
					<div class="flex gap-2 items-center">
						<MapPinIcon class="w-5 text-orange-500 stroke-1.5" />
						<span class="font-semibold text-sm">
							{{ offeringData?.data.location[0] }}
						</span>
					</div>
				</div>
			</div>
			<div class="h-[450px] overflow-hidden rounded-3xl">
				<NuxtImg
					:src="offeringData?.data.banners[0].url"
					:alt="offeringData?.data.name"
					:title="offeringData?.data.name"
					class="object-cover w-full"
				/>
			</div>
			<div
				class="relative bg-white rounded-3xl -mt-20 mx-auto w-[99%] px-16 py-20 flex gap-8"
			>
				<div class="flex flex-col gap-10 w-[calc(100%_-_400px)]">
					<div class="flex flex-col gap-6">
						<div class="font-semibold text-lg">
							{{ 'About ' + offeringData?.data.name }}
						</div>
						<div class="whitespace-pre-line leading-7">
							{{ offeringData?.data.description }}
						</div>
					</div>
					<div class="flex flex-col gap-6">
						<div class="font-semibold text-lg">Host</div>
						<div class="flex gap-4 items-center">
							<NuxtImg
								:src="offeringData?.data.studio.logo[0].url || ''"
								:alt="offeringData?.data.studio.name || ''"
								:title="offeringData?.data.studio.name"
								class="w-20 rounded-full"
							/>
							<NuxtLink to="/">
								<span class="font-semibold text-lg">
									{{ offeringData?.data.studio.name }}
								</span>
							</NuxtLink>
						</div>
					</div>
					<div class="flex flex-col gap-6">
						<div class="font-semibold text-lg">Practitioners</div>
						<div
							class="flex gap-4 items-center"
							v-for="practitioner of offeringData?.data.practitioners"
							:key="practitioner.id"
						>
							<NuxtImg
								:src="practitioner.profileImage || ''"
								:alt="practitioner.name || ''"
								:title="practitioner.name"
								class="w-12 rounded-full"
							/>
							<NuxtLink to="/">
								<span class="font-semibold">
									{{ practitioner.name }}
								</span>
							</NuxtLink>
						</div>
					</div>
					<div class="flex flex-col gap-6">
						<div class="font-semibold text-lg">Location</div>
						<div class="border rounded-xl p-6 font-semibold">
							{{ offeringData?.data.location[0] }}
						</div>
					</div>
				</div>
				<!-- <div class="bg-red-200/20 rounded-xl p-10 w-[400px] self-start">
				Sidebar
			</div> -->
			</div>
		</template>
	</MainContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { activityColorClass } from '~/helpers'
import type { IOffering } from '~/helpers/types/offering'
import { CalendarIcon, MapPinIcon } from '@heroicons/vue/24/outline'
import { dateString } from '~/lib/utils'

export default defineComponent({
	name: 'SingleOffering',
})
</script>
<script lang="ts" setup>
const route = useRoute()
const { data: offeringData } = await useFetch<{ data: IOffering }>(
	`/api/offerings/${route.params.slug}`
)
</script>
