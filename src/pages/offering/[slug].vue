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
				<NuxtImg
					v-if="!offering.data.banners.length"
					src="/img/banner-placeholder2.jpeg"
					:alt="offering.data.name"
					:title="offering.data.name"
					class="object-cover w-full h-full rounded-3xl opacity-70"
					sizes="400px md:800px lg:1280px"
					format="webp"
				/>
				<SwiperBlockV2
					v-else
					:length="offering.data.banners.length"
					class="h-[250px] sm:h-[350px] xl:h-[450px]"
					classSlideContainer="overflow-hidden rounded-3xl"
				>
					<swiper-slide
						v-for="(banner, idx) of offering.data.banners"
						:key="idx"
					>
						<div
							class="h-[250px] sm:h-[350px] xl:h-[450px] cursor-pointer bg-neutral-200/70 overflow-hidden rounded-3xl relative"
							@click="openGallery(idx)"
						>
							<NuxtImg
								:src="banner.url"
								:alt="offering.data.name"
								:title="offering.data.name"
								class="object-cover w-full h-full rounded-3xl"
								:provider="banner ? 'cloudinary' : undefined"
								placeholder="/img/banner-placeholder2.jpeg"
								:loading="idx === 0 ? 'eager' : 'lazy'"
								:fetchpriority="idx === 0 ? 'high' : 'auto'"
								sizes="400px md:800px lg:1280px"
								format="webp"
							/>
						</div>
					</swiper-slide>
				</SwiperBlockV2>

				<button
					v-if="offering.data.banners.length"
					type="button"
					@click="openGallery(0)"
					class="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-2 px-3.5 py-2 bg-white/90 hover:bg-white text-gray-800 text-xs sm:text-sm font-semibold rounded-2xl shadow-md backdrop-blur-md transition-all duration-200 border border-black/5 hover:scale-105 active:scale-95 group cursor-pointer"
				>
					<PhotoIcon class="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
					<span>All photos ({{ offering.data.banners.length }})</span>
				</button>
			</div>
			<div
				class="relative bg-white rounded-3xl -mt-6 mx-auto w-full md:w-[99%] px-6 sm:px-10 lg:px-16 py-10 md:py-20 flex gap-8 flex-col-reverse lg:flex-row"
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
					<div class="flex items-center justify-between pb-1">
						<h3 class="font-bold text-xl text-zinc-900">Tickets</h3>
						<span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
							{{ offering.data.tickets.length }} {{ offering.data.tickets.length === 1 ? 'ticket' : 'tickets' }}
						</span>
					</div>

					<div class="flex flex-col gap-3">
						<div
							v-for="ticket of offering.data.tickets"
							:key="ticket.id"
							@click="selectedTicket = ticket.id; error = ''"
							class="group flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none text-left"
							:class="{
								'border-orange-500/80 bg-orange-50/80 shadow-sm ring-1 ring-orange-500/20':
									selectedTicket === ticket.id,
								'border-gray-200 bg-white/70 hover:bg-white hover:border-orange-300':
									selectedTicket !== ticket.id,
							}"
							role="radio"
							:aria-checked="selectedTicket === ticket.id"
						>
							<!-- Large stylized radio button -->
							<div class="pt-0.5 shrink-0">
								<div
									class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 shadow-sm"
									:class="{
										'border-orange-500 bg-orange-500':
											selectedTicket === ticket.id,
										'border-gray-300 bg-white group-hover:border-orange-400':
											selectedTicket !== ticket.id,
									}"
								>
									<div
										class="w-2.5 h-2.5 rounded-full bg-white transition-all duration-200"
										:class="{
											'scale-100 opacity-100': selectedTicket === ticket.id,
											'scale-0 opacity-0': selectedTicket !== ticket.id,
										}"
									/>
								</div>
							</div>

							<!-- Ticket details -->
							<div class="flex flex-col flex-1 min-w-0">
								<div class="flex items-baseline justify-between gap-2">
									<p class="font-bold text-base text-zinc-900 group-hover:text-orange-600 transition-colors">
										{{ ticket.name }}
									</p>
									<span class="font-bold text-lg text-zinc-900 shrink-0">
										{{ ticket.price }}
									</span>
								</div>
								<p v-if="ticket.description" class="text-xs text-gray-600 mt-1 leading-relaxed">
									{{ ticket.description }}
								</p>
							</div>
						</div>
					</div>

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

			<ImageGalleryModal
				v-model:isOpen="isGalleryOpen"
				:images="offering.data.banners"
				:initialIndex="galleryInitialIndex"
				:title="offering.data.name"
			/>
		</template>
	</MainContainer>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import {
	CalendarIcon,
	MapPinIcon,
	ClockIcon,
	PhotoIcon,
} from '@heroicons/vue/24/outline'
import { dateString } from '~/src/shared/lib/utils'
import type { TOffering } from '~/src/app/types/offering'
import SwiperBlockV2 from '~/src/shared/ui/SwiperBlockV2.vue'
import ImageGalleryModal from '~/src/widgets/ImageGalleryModal.vue'

export default defineComponent({
	name: 'SingleOffering',
})
</script>
<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const error = ref('')

const isGalleryOpen = ref(false)
const galleryInitialIndex = ref(0)

function openGallery(index = 0) {
	galleryInitialIndex.value = index
	isGalleryOpen.value = true
}

const { data: offering } = await useFetch<{ data: TOffering }>(
	`/api/offerings/${route.params.slug}`
)

const selectedTicket = ref(
	offering.value?.data?.tickets[offering.value?.data?.tickets.length - 1]?.id ||
		''
)

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
		: '/img/banner-placeholder2.jpeg',
	twitterCard: 'summary_large_image',
})
</script>
