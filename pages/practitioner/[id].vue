<template>
	<MainContainer>
		<div class="py-10">
			<div
				v-if="practitioner"
				class="rounded-3xl bg-white p-4 py-8 sm:p-10 md:p-20 flex gap-x-8 flex-col lg:flex-row gap-4 lg:gap-0"
			>
				<div class="flex flex-1 flex-col gap-12">
					<div class="flex gap-6 sm:gap-8">
						<NuxtImg
							provider="cloudinary"
							:src="practitioner.data.profileImage || ''"
							:alt="practitioner.data.name || ''"
							class="w-24 h-24 md:w-40 md:h-40 rounded-full object-cover object-center"
							sizes="96px md:160px"
						/>
						<div class="flex flex-col gap-y-3 justify-center">
							<p class="text-3xl font-semibold">{{ practitioner.data.name }}</p>
							<div class="flex gap-2">
								<img
									:src="practitioner.data.studios[0].logo.url"
									class="w-8 h-8 rounded-full object-cover object-center"
								/>
								<NuxtLink :to="'/studio/' + practitioner.data.studios[0].slug">
									<span class="font-semibold text-lg">
										{{ practitioner.data.studios[0].name }}
									</span>
								</NuxtLink>
							</div>
							<div class="flex gap-1 text-gray-600 items-start">
								<MapPinIcon class="w-6 stroke-1 shrink-0" />
								<div class="flex flex-col gap-1">
									<a
										v-for="studio of practitioner.data.studios"
										:key="studio.id"
										:href="`https://www.google.com/maps/place/${
											studio.location?.name || ''
										}`"
										target="_blank"
									>
										<span class="font-semibold">
											{{ studio.location?.name }}
										</span>
									</a>
								</div>
							</div>
						</div>
					</div>
					<div v-if="practitioner.data.bio" class="flex flex-col gap-4">
						<div class="font-semibold text-lg">About</div>
						<div class="whitespace-pre-line leading-7">
							{{ practitioner.data.bio }}
						</div>
					</div>
					<Button disabled class="self-start">
						Tip {{ practitioner.data.name }}
					</Button>
				</div>
				<div class="lg:pt-20">
					<Button disabled>
						Book private appointment {{ practitioner.data.name }}
					</Button>
				</div>
			</div>
		</div>
	</MainContainer>
</template>

<script lang="ts">
/**
 * Single practitioner page by user id
 */
import { defineComponent } from 'vue'
import type { TStudio } from '~/helpers/types/studio'
import type { TUser } from '~/server/types'
import { MapPinIcon } from '@heroicons/vue/24/outline'
import type { TOffering } from '~/helpers/types/offering'

export default defineComponent({
	name: 'PractitionerPage',
})
</script>
<script lang="ts" setup>
const route = useRoute()
const { id } = route.params
const { data: practitioner } = await useFetch<{
	data: TUser & { studios: TStudio[]; offerings: TOffering[] }
}>('/api/practitioners/' + id)
</script>
