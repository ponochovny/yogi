<template>
	<MainContainer>
		<template v-if="studio">
			<div
				class="h-[200px] sm:h-[300px] xl:h-[450px] overflow-hidden rounded-t-3xl mt-14"
				:class="{ 'bg-orange-400/70': !studio.data.banner.length }"
			>
				<NuxtImg
					v-if="studio.data.banner.length"
					provider="cloudinary"
					:src="studio.data.banner[0].url"
					:alt="studio.data.name"
					:title="studio.data.name"
					sizes="400px md:800px lg:1280px"
					class="object-cover object-center w-full h-full"
					format="webp"
				/>
			</div>
			<div
				class="relative bg-white rounded-b-3xl mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:pt-24 lg:pt-28 flex mb-10"
			>
				<div
					class="absolute w-28 h-28 -top-12 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:w-36 sm:h-36 sm:-top-16 sm:left-16 lg:w-44 lg:h-44 lg:-top-20 lg:left-24 border-4 border-white rounded-full"
				>
					<!-- TODO: if no logo -->
					<NuxtImg
						v-if="studio.data.logo.url"
						provider="cloudinary"
						:src="studio.data.logo.url"
						:alt="studio.data.name"
						:title="studio.data.name"
						class="object-cover rounded-full border-gray-200 border object-center w-full h-full"
						sizes="112px sm:144px lg:176px"
						format="webp"
					/>
				</div>
				<div
					class="flex gap-4 sm:gap-8 flex-col w-full lg:w-[calc(100%_-_200px)] xl:w-[calc(100%_-_400px)]"
				>
					<div class="flex flex-col gap-2 sm:gap-4">
						<div class="flex gap-1 text-sm items-center flex-col sm:flex-row">
							<div class="flex gap-1 text-xs font-semibold flex-wrap">
								<span
									class="text-rose-500 uppercase"
									v-for="(type, idx) of studio.data.types"
									:key="type"
								>
									{{ type
									}}{{ idx === studio.data.types.length - 1 ? '' : ',' }}
								</span>
							</div>
							<span class="sm:block hidden"> • </span>
							<div class="flex flex-wrap">
								<span
									v-for="(cat, idx) of studio.data.categories"
									:key="cat"
									class="text-xs mr-1"
								>
									{{ cat
									}}{{ idx === studio.data.categories.length - 1 ? '' : ',' }}
								</span>
							</div>
						</div>
						<div class="text-2xl sm:text-3xl font-semibold">
							{{ studio.data.name }}
						</div>
						<div class="flex gap-2 items-center">
							<MapPinIcon class="w-5 stroke-1.5" />
							<a
								:href="`https://www.google.com/maps/place/${studio.data.location?.name}`"
								target="_blank"
							>
								<span class="font-semibold text-sm">
									{{ studio.data.location?.name }}
								</span>
							</a>
						</div>
					</div>
					<div v-if="studio.data.bio" class="flex flex-col gap-3 sm:gap-6">
						<div class="font-semibold text-lg">About</div>
						<div class="whitespace-pre-line leading-7">
							{{ studio.data.bio }}
						</div>
					</div>

					<div
						v-if="studio.data.practitioners.length"
						class="flex flex-col gap-3 sm:gap-6"
					>
						<div class="font-semibold text-lg">Practitioners</div>
						<div class="flex gap-4 flex-wrap">
							<div
								class="flex gap-4 items-center"
								v-for="practitioner of studio.data.practitioners"
								:key="practitioner.id"
							>
								<NuxtImg
									provider="cloudinary"
									:src="practitioner.profileImage || ''"
									:alt="practitioner.name || ''"
									:title="practitioner.name"
									class="w-12 rounded-full"
									width="48"
									height="48"
									format="webp"
								/>
								<NuxtLink :to="'/practitioner/' + practitioner.id">
									<span class="font-semibold">
										{{ practitioner.name }}
									</span>
								</NuxtLink>
							</div>
						</div>
					</div>

					<div v-if="studio.data.mission" class="flex flex-col gap-3 sm:gap-6">
						<div class="font-semibold text-lg">Mission</div>
						<div class="whitespace-pre-line leading-7">
							{{ studio.data.mission }}
						</div>
					</div>

					<div class="flex flex-col gap-3 sm:gap-6">
						<div class="font-semibold text-lg">Location</div>
						<div
							class="border rounded-xl font-semibold flex flex-col"
							:class="{
								'p-6': !studio.data.location?.name,
								'pb-6': studio.data.location?.name,
							}"
						>
							<div
								v-if="studio.data.location?.name"
								class="w-full h-[300px] rounded-t-xl overflow-hidden"
							>
								<Map
									:zoom="14"
									:center="studio.data.location.coords"
									:markers="[studio.data.location]"
								/>
							</div>
							<a
								:href="`https://www.google.com/maps/place/${studio.data.location?.name}`"
								target="_blank"
								:class="{ 'px-6 pt-3': studio.data.location?.name }"
							>
								<span>
									{{ studio.data.location?.name || studio.data.location }}
								</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</template>
	</MainContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { TStudio } from '~/src/app/types/studio'
import { MapPinIcon } from '@heroicons/vue/24/outline'

export default defineComponent({
	name: 'StudioPage',
})
</script>
<script lang="ts" setup>
const route = useRoute()
const { data: studio } = await useFetch<{ data: TStudio }>(
	`/api/studios/${route.params.slug}`
)

useSeoMeta({
	title: studio.value?.data.name,
	ogTitle: studio.value?.data.name,
	description: studio.value?.data.bio,
	ogDescription: studio.value?.data.bio,
	ogImage: studio.value?.data.banner.length
		? studio.value?.data.banner[0].url
		: 'img/banner-placeholder2.jpeg',
	twitterCard: 'summary_large_image',
})
</script>
