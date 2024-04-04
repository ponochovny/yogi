<template>
	<MainContainer>
		<div class="py-10">
			<div v-if="practitioner" class="rounded-3xl bg-white p-20 flex gap-x-8">
				<div class="flex flex-1 flex-col gap-12">
					<div class="flex gap-8">
						<img
							:src="practitioner.data.profileImage || ''"
							:alt="practitioner.data.name || ''"
							class="w-40 h-40 rounded-full object-cover object-center"
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
							<div class="flex gap-1 text-gray-600">
								<MapPinIcon class="w-6 stroke-1" />
								<span class="font-semibold">
									{{ practitioner.data.studios[0].location[0] }}
								</span>
							</div>
						</div>
					</div>
					<div v-if="practitioner.data.bio" class="flex flex-col gap-4">
						<div class="font-semibold text-lg">About</div>
						<div class="whitespace-pre-line leading-7">
							{{ practitioner.data.bio }}
						</div>
					</div>
					<Button class="self-start">Tip {{ practitioner.data.name }}</Button>
				</div>
				<div class="pt-20">
					<Button>Book private appointment {{ practitioner.data.name }}</Button>
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
import type { IOffering } from '~/helpers/types/offering'
import type { IStudio } from '~/helpers/types/studio'
import type { IUser } from '~/server/types'
import { MapPinIcon } from '@heroicons/vue/24/outline'

export default defineComponent({
	name: 'PractitionerPage',
})
</script>
<script lang="ts" setup>
const route = useRoute()
const { id } = route.params
const { data: practitioner } = await useFetch<{
	data: IUser & { studios: IStudio[]; offerings: IOffering[] }
}>('/api/practitioners/' + id)
</script>
