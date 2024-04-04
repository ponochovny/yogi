<template>
	<MainContainer>
		<template v-if="offeringData">
			<div class="flex flex-col gap-3 mt-14 mb-10">
				<div class="flex gap-1 text-sm">
					<div class="flex gap-1 text-xs font-semibold">
						<span
							class="capitalize font-bold"
							:class="{
								'text-blue-500':
									offeringData.data.activity.toLowerCase() === 'class',
								'text-red-400':
									offeringData.data.activity.toLowerCase() === 'event',
								'text-yellow-500':
									offeringData.data.activity.toLowerCase() === 'appointment',
							}"
						>
							{{ offeringData.data.activity }}
						</span>
						<span> • </span>
					</div>
					<div class="flex flex-wrap">
						<span
							v-for="cat of offeringData.data.categories"
							:key="cat"
							class="text-xs mr-1"
						>
							{{ cat }}
						</span>
					</div>
				</div>
				<div class="text-3xl font-semibold">{{ offeringData.data.name }}</div>
				<div class="flex gap-4 items-center">
					<div class="flex gap-2 items-center">
						<CalendarIcon class="w-5 text-orange-500 stroke-1.5" />
						<span class="font-semibold text-sm text-gray-600">
							{{ dateString(offeringData.data.start, offeringData.data.end) }}
						</span>
					</div>
					<div class="flex gap-2 items-center">
						<MapPinIcon class="w-5 text-orange-500 stroke-1.5" />
						<span class="font-semibold text-sm">
							{{ offeringData.data.location[0] }}
						</span>
					</div>
					<div class="flex gap-2 items-center">
						<ClockIcon class="w-5 text-orange-500 stroke-1.5" />
						<span class="font-semibold text-sm">
							{{ offeringData.data.duration + 'min.' }}
						</span>
					</div>
				</div>
			</div>
			<div class="h-[450px] overflow-hidden rounded-3xl">
				<NuxtImg
					:src="
						offeringData.data.banners.length
							? offeringData.data.banners[0].url
							: 'img/banner-placeholder2.jpeg'
					"
					:alt="offeringData.data.name"
					:title="offeringData.data.name"
					class="object-cover w-full h-full"
					:class="{
						'opacity-70': !offeringData.data.banners.length,
					}"
				/>
			</div>
			<div
				class="relative bg-white rounded-3xl -mt-20 mx-auto w-[99%] px-16 py-20 flex gap-8"
			>
				<div class="flex flex-col gap-10 w-[calc(100%_-_400px)]">
					<div v-if="offeringData.data.description" class="flex flex-col gap-6">
						<div class="font-semibold text-lg">
							{{ 'About ' + offeringData.data.name }}
						</div>
						<div class="whitespace-pre-line leading-7">
							{{ offeringData.data.description }}
						</div>
					</div>
					<div class="flex flex-col gap-6">
						<div class="font-semibold text-lg">Host</div>
						<div class="flex gap-4 items-center">
							<NuxtImg
								:src="offeringData.data.studio?.logo.url || ''"
								:alt="offeringData.data.studio?.name || ''"
								:title="offeringData.data.studio?.name"
								class="w-20 h-20 rounded-full object-cover object-center"
							/>
							<NuxtLink to="/">
								<span class="font-semibold text-lg">
									{{ offeringData.data.studio?.name }}
								</span>
							</NuxtLink>
						</div>
					</div>
					<div
						v-if="offeringData.data.practitioners.length"
						class="flex flex-col gap-6"
					>
						<div class="font-semibold text-lg">Practitioners</div>
						<div
							class="flex gap-4 items-center"
							v-for="practitioner of offeringData.data.practitioners"
							:key="practitioner.id"
						>
							<NuxtImg
								:src="practitioner.profileImage || ''"
								:alt="practitioner.name || ''"
								:title="practitioner.name"
								class="w-12 rounded-full"
							/>
							<NuxtLink :to="'/practitioner/' + practitioner.id">
								<span class="font-semibold">
									{{ practitioner.name }}
								</span>
							</NuxtLink>
						</div>
					</div>
					<div class="flex flex-col gap-6">
						<div class="font-semibold text-lg">Location</div>
						<div class="border rounded-xl p-6 font-semibold">
							{{ offeringData.data.location[0] }}
						</div>
					</div>
				</div>
				<div
					v-if="offeringData.data.tickets.length"
					class="bg-red-200/20 rounded-xl p-10 w-[400px] self-start flex flex-col gap-4"
				>
					<button
						v-for="ticket of offeringData.data.tickets"
						:key="ticket.id"
						@click="selectedTicket = ticket.id"
					>
						<div
							class="flex gap-4 px-2 py-1 border rounded-lg border-gray-400 text-left text-black transition-colors"
							:class="{
								'hover:bg-orange-200/20 hover:border-orange-400/50 pl-7':
									selectedTicket !== ticket.id,
								'bg-orange-200/20 border-orange-400/50':
									selectedTicket === ticket.id,
							}"
						>
							<TicketIcon
								v-if="selectedTicket === ticket.id"
								class="w-10 text-gray-700 stroke-1"
							/>
							<div class="flex flex-col">
								<p>{{ ticket.name }}</p>
								<p class="text-xs">{{ ticket.description }}</p>
								<span class="font-semibold text-lg">
									{{
										currencySymbolByCode(ticket.currency) + '' + ticket.price
									}}
								</span>
							</div>
						</div>
					</button>
					<div class="text-rose-500">
						{{ error && !selectedTicket ? error : '' }}
					</div>
					<Button @click="handleCheckout(selectedTicket, 1)">
						<span class="font-semibold mx-auto">Checkout</span>
					</Button>
				</div>
			</div>
		</template>
	</MainContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { currencySymbolByCode } from '~/helpers'
import type { IOffering } from '~/helpers/types/offering'
import {
	CalendarIcon,
	MapPinIcon,
	TicketIcon,
	ClockIcon,
} from '@heroicons/vue/24/outline'
import { dateString } from '~/lib/utils'

export default defineComponent({
	name: 'SingleOffering',
})
</script>
<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const error = ref('')

const { data: offeringData } = await useFetch<{ data: IOffering }>(
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
</script>
