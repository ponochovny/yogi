<template>
	<MainContainer>
		<template v-if="offering">
			<div class="flex flex-col gap-3 mt-6 sm:mt-14 mb-4 sm:mb-10">
				<div class="flex gap-1 text-sm">
					<div class="flex gap-1 text-xs font-semibold">
						<span
							class="capitalize font-bold"
							:class="{
								'text-blue-500/90':
									offering.data.activity.toLowerCase() === 'class',
								'text-red-400':
									offering.data.activity.toLowerCase() === 'event',
								'text-yellow-500':
									offering.data.activity.toLowerCase() === 'appointment',
							}"
						>
							{{ offering.data.activity }}
						</span>
						<span> • </span>
					</div>
					<div class="flex flex-wrap">
						<span
							v-for="cat of offering.data.categories"
							:key="cat"
							class="text-xs mr-1"
						>
							{{ cat }}
						</span>
					</div>
				</div>
				<div class="text-2xl sm:text-3xl font-semibold">
					{{ offering.data.name }}
				</div>
				<div class="flex gap-2 sm:gap-4 sm:items-center flex-col sm:flex-row">
					<div class="flex gap-2 items-center">
						<CalendarIcon class="w-5 text-orange-500 stroke-1.5" />
						<span class="font-semibold text-sm text-gray-600">
							{{ dateString(offering.data.start, offering.data.end) }}
						</span>
					</div>
					<a
						:href="`https://www.google.com/maps/place/${offering.data.location?.name}`"
						target="_blank"
						class="flex gap-2 items-center"
					>
						<MapPinIcon class="w-5 text-orange-500 stroke-1.5" />
						<span class="font-semibold text-sm">
							{{ offering.data.location?.name }}
						</span>
					</a>

					<div class="flex gap-2 items-center">
						<ClockIcon class="w-5 text-orange-500 stroke-1.5" />
						<span class="font-semibold text-sm">
							{{ offering.data.duration + 'min.' }}
						</span>
					</div>
				</div>
			</div>
			<div class="relative h-[250px] sm:h-[350px] xl:h-[450px] z-0">
				<SwiperBlock
					:length="offering.data.banners.length"
					class="h-[250px] sm:h-[350px] xl:h-[450px]"
					classSlideContainer="overflow-hidden rounded-3xl"
				>
					<SwiperSlide
						v-for="(banner, idx) of offering.data.banners"
						:key="idx"
					>
						<div class="h-[250px] sm:h-[350px] xl:h-[450px]">
							<NuxtImg
								:src="banner.url || 'img/banner-placeholder2.jpeg'"
								:alt="offering.data.name"
								:title="offering.data.name"
								class="object-cover w-full h-full rounded-3xl"
								:provider="banner ? 'cloudinary' : undefined"
								placeholder
								sizes="400px md:800px lg:1280px"
								format="webp"
								:class="{
									'opacity-70': !banner,
								}"
							/>
						</div>
					</SwiperSlide>
				</SwiperBlock>
			</div>
			<div
				class="relative bg-white rounded-3xl -mt-20 mx-auto w-full md:w-[99%] px-6 sm:px-10 lg:px-16 py-10 md:py-20 flex gap-8 flex-col-reverse lg:flex-row"
			>
				<div
					class="flex flex-col gap-4 sm:gap-8 w-full lg:w-[calc(100%_-_200px)] xl:w-[calc(100%_-_400px)]"
				>
					<div
						v-if="offering.data.description"
						class="flex flex-col gap-3 sm:gap-6"
					>
						<div class="font-semibold text-lg">
							{{ 'About ' + offering.data.name }}
						</div>
						<div class="whitespace-pre-line leading-6 sm:leading-7">
							{{ offering.data.description }}
						</div>
					</div>
					<div class="flex flex-col gap-3 sm:gap-6">
						<div class="font-semibold text-lg">Host</div>
						<div class="flex gap-4 items-center">
							<NuxtImg
								:src="offering.data.studio?.logo.url || ''"
								:alt="offering.data.studio?.name || ''"
								:title="offering.data.studio?.name"
								class="w-20 h-20 rounded-full object-cover object-center"
								provider="cloudinary"
								format="webp"
								width="80"
								height="80"
							/>
							<NuxtLink :to="`/studio/${offering.data.studio?.slug || ''}`">
								<span class="font-semibold text-lg">
									{{ offering.data.studio?.name }}
								</span>
							</NuxtLink>
						</div>
					</div>
					<div
						v-if="offering.data.practitioners.length"
						class="flex flex-col gap-3 sm:gap-6"
					>
						<div class="font-semibold text-lg">Practitioners</div>
						<div class="flex flex-wrap gap-4 flex-col sm:flex-row">
							<div
								class="flex gap-4 items-center"
								v-for="practitioner of offering.data.practitioners"
								:key="practitioner.id"
							>
								<NuxtImg
									:src="practitioner.profileImage || ''"
									:alt="practitioner.name || ''"
									:title="practitioner.name"
									class="w-12 h-12 rounded-full"
									provider="cloudinary"
									format="webp"
									width="48"
									height="48"
								/>
								<NuxtLink :to="'/practitioner/' + practitioner.id">
									<span class="font-semibold">
										{{ practitioner.name }}
									</span>
								</NuxtLink>
							</div>
						</div>
					</div>
					<div class="flex flex-col gap-3 sm:gap-6">
						<div class="font-semibold text-lg">Location</div>
						<div
							class="border rounded-xl font-semibold flex flex-col"
							:class="{
								'p-6': !offering.data.location?.name,
								'pb-6': offering.data.location?.name,
							}"
						>
							<div
								v-if="offering.data.location?.name"
								class="w-full h-[300px] rounded-t-xl overflow-hidden"
							>
								<Map
									:zoom="14"
									:center="offering.data.location.coords"
									:markers="[offering.data.location]"
								/>
							</div>
							<a
								:href="`https://www.google.com/maps/place/${offering.data.location?.name}`"
								target="_blank"
								:class="{ 'px-6 pt-3': offering.data.location?.name }"
							>
								<span>
									{{ offering.data.location?.name || offering.data.location }}
								</span>
							</a>
						</div>
					</div>
				</div>
				<div
					v-if="offering.data.tickets?.length"
					class="bg-red-200/20 rounded-xl p-4 sm:p-6 md:p-10 w-full lg:w-[400px] self-start flex flex-col gap-4"
				>
					<button
						v-for="ticket of offering.data.tickets"
						:key="ticket.id"
						@click="selectedTicket = ticket.id"
					>
						<div
							class="flex gap-4 px-2 py-1 border rounded-lg border-gray-400 text-left text-black transition-colors"
							:class="{
								'hover:bg-orange-200/20 hover:border-orange-400/50':
									selectedTicket !== ticket.id,
								'bg-orange-200/20 border-orange-400/50':
									selectedTicket === ticket.id,
							}"
						>
							<TicketIcon
								v-if="selectedTicket === ticket.id"
								class="w-10 text-gray-700 stroke-1 shrink-0"
							/>
							<div v-else class="w-10 block"></div>
							<div class="flex flex-col">
								<p>{{ ticket.name }}</p>
								<p class="text-xs">{{ ticket.description }}</p>
								<span class="font-semibold text-lg">
									{{ ticket.price }}
								</span>
							</div>
						</div>
					</button>
					<div class="text-rose-500" :class="{ hidden: !error }">
						{{ error && !selectedTicket ? error : '' }}
					</div>
					<Button
						@click="handleCheckout(selectedTicket, 1)"
						class="mx-auto w-full max-w-[300px] lg:w-full"
					>
						<span class="font-semibold mx-auto">Checkout</span>
					</Button>
				</div>
			</div>
		</template>
	</MainContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
	CalendarIcon,
	MapPinIcon,
	TicketIcon,
	ClockIcon,
} from '@heroicons/vue/24/outline'
import { dateString } from '~/lib/utils'
import type { TOffering } from '~/helpers/types/offering'

export default defineComponent({
	name: 'SingleOffering',
})
</script>
<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const error = ref('')

const { data: offering } = await useFetch<{ data: TOffering }>(
	`/api/offerings/${route.params.slug}`
)

const selectedTicket = ref('')

function handleCheckout(ticketId: string, count: number) {
	if (!selectedTicket.value) {
		error.value = 'Please select a ticket'
		return
	}
	router.push(`/checkout?count=${count}&ticketId=${ticketId}`)
}

useSeoMeta({
	title: offering.value?.data.name,
	ogTitle: offering.value?.data.name,
	description: offering.value?.data.description,
	ogDescription: offering.value?.data.description,
	ogImage: offering.value?.data.banners.length
		? offering.value?.data.banners[0].url
		: 'img/banner-placeholder2.jpeg',
	twitterCard: 'summary_large_image',
})
</script>
