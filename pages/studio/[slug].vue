<template>
	<MainContainer>
		<div
			class="h-[450px] overflow-hidden rounded-t-3xl mt-14"
			:class="{ 'bg-orange-400/70': !studio.banner.length }"
		>
			<NuxtImg
				v-if="studio.banner.length"
				:src="studio.banner[0].url"
				:alt="studio.name"
				:title="studio.name"
				class="object-cover w-full"
			/>
		</div>
		<div class="relative bg-white rounded-b-3xl mx-auto px-16 py-20 pt-28 flex">
			<div
				class="absolute w-44 h-44 -top-20 left-24 border-4 border-white rounded-full"
			>
				<NuxtImg
					:src="studio.logo[0].url"
					:alt="studio.name"
					:title="studio.name"
					class="w-full object-cover rounded-full border-gray-200 border"
				/>
			</div>
			<div class="flex gap-8 flex-col w-[calc(100%_-_400px)]">
				<div class="flex flex-col gap-4">
					<div class="flex gap-1 text-sm">
						<div class="flex gap-1 text-xs font-semibold">
							<span
								class="text-rose-500 uppercase"
								v-for="type of studio.types"
								:key="type"
							>
								{{ type }}
							</span>
							<span> • </span>
						</div>
						<div class="flex flex-wrap">
							<span
								v-for="cat of studio.categories"
								:key="cat"
								class="text-xs mr-1"
							>
								{{ cat }}
							</span>
						</div>
					</div>
					<div class="text-3xl font-semibold">{{ studio.name }}</div>
					<div class="flex gap-2 items-center">
						<MapPinIcon class="w-5 stroke-1.5" />
						<span class="font-semibold text-sm">
							{{ studio.location[0] }}
						</span>
					</div>
				</div>
				<div class="flex flex-col gap-6">
					<div class="font-semibold text-lg">About</div>
					<div class="whitespace-pre-line leading-7">{{ studio.bio }}</div>
				</div>

				<div class="flex flex-col gap-6">
					<div class="font-semibold text-lg">Practitioners</div>
					<div class="flex gap-4 flex-wrap">
						<div
							class="flex gap-4 items-center"
							v-for="practitioner of studio.practitioners"
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
				</div>

				<div class="flex flex-col gap-6">
					<div class="font-semibold text-lg">Mission</div>
					<div class="whitespace-pre-line leading-7">{{ studio.mission }}</div>
				</div>

				<div class="flex flex-col gap-6">
					<div class="font-semibold text-lg">Location</div>
					<div class="border rounded-xl p-6 font-semibold">
						{{ studio.location[0] }}
					</div>
				</div>
			</div>
		</div>
	</MainContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { IStudio } from '~/helpers/types/studio'
import { MapPinIcon } from '@heroicons/vue/24/outline'

export default defineComponent({
	name: 'StudioPage',
})
</script>
<script lang="ts" setup>
const route = useRoute()
const { data: studio } = await useFetchApi<{ data: IStudio }>(
	`/api/studios/${route.params.slug}`
)
</script>
