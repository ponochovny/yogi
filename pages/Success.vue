<template>
	<MainContainer>
		<!-- TODO: Add confetti <if (purchase)> -->
		<div class="py-8 sm:py-10 flex flex-col gap-4 sm:gap-10 items-center">
			<div class="flex flex-col gap-1">
				<p class="font-semibold text-2xl sm:text-3xl text-center">
					{{ purchase ? 'Successful purchase!' : 'Payment in progress...' }}
				</p>
				<p
					v-if="purchase?.data.receiptEmail || !purchase"
					class="text-center text-xs text-gray-600"
				>
					{{
						purchase && purchase?.data.receiptEmail
							? 'Purchase information has been sent to the provided email'
							: 'Reload this page to get updates'
					}}
				</p>
			</div>
			<div
				v-if="
					purchase && purchase?.data?.ticket && purchase?.data.ticket.offering
				"
				class="flex gap-3 px-6 py-5 rounded-xl bg-white shadow-lg"
			>
				<img
					:src="purchase?.data.ticket.offering.banner[0]"
					class="w-24 h-16 rounded-xl object-cover object-center"
				/>
				<div class="flex flex-col">
					<span
						class="capitalize font-bold text-sm"
						:class="{
							'text-blue-500/90':
								purchase?.data.ticket.offering.activity.toLowerCase() ===
								'class',
							'text-red-400':
								purchase?.data.ticket.offering.activity.toLowerCase() ===
								'event',
							'text-yellow-500':
								purchase?.data.ticket.offering.activity.toLowerCase() ===
								'appointment',
						}"
					>
						{{ purchase?.data.ticket.offering.activity }}
					</span>
					<NuxtLink :to="`/offering/${purchase?.data.ticket.offering.slug}`">
						<span class="font-semibold">
							{{ purchase?.data.ticket.offering.name }}
						</span>
					</NuxtLink>
					<span class="font-semibold text-sm text-gray-600">
						{{
							dateString(
								purchase?.data.ticket.offering.start,
								purchase?.data.ticket.offering.end
							)
						}}
					</span>
					<span class="font-semibold text-sm">
						{{ purchase?.data.ticket.offering.location.name }}
					</span>
					<div class="flex items-center gap-2 text-orange-500">
						<TicketIcon class="w-7 stroke-1" />
						<span class="font-semibold">{{ purchase?.data.ticket.name }}</span>
					</div>
				</div>
			</div>
			<div v-if="payment_intent" class="flex gap-2 items-center">
				<span class="font-semibold">
					{{ purchase ? 'Purchase' : 'Payment' }} id:
				</span>
				<span class="bg-gray-200 border-gray-300 border p-2 py-1 rounded-md">
					<pre>{{ payment_intent }}</pre>
				</span>
			</div>
		</div>
	</MainContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { dateString } from '~/lib/utils'
import { TicketIcon } from '@heroicons/vue/24/outline'
import type { IPurchase } from '~/helpers/types/purchase'

export default defineComponent({
	name: 'SuccessPage',
})
</script>
<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const { payment_intent } = route.query

const { data: purchase } = useFetch<{ data: IPurchase }>(
	`/api/purchase/${payment_intent}`
)

if (!purchase) router.push('/')

useSeoMeta({
	title: 'Success payment',
	ogTitle: 'Success payment',
	description:
		'Wellness marketplace, book your next appointment, retreat, festival',
	ogDescription:
		'Wellness marketplace, book your next appointment, retreat, festival',
	ogImage: 'img/logoBg.svg',
	twitterCard: 'summary',
})
</script>
