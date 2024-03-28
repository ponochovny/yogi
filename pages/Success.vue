<template>
	<MainContainer>
		<!-- TODO: Add confetti -->
		<div class="py-10 flex flex-col gap-10 items-center">
			<div class="flex flex-col gap-1">
				<p class="font-semibold text-3xl text-center">Successful purchase!</p>
				<p
					v-if="purchase?.data.receiptEmail"
					class="text-center text-xs text-gray-600"
				>
					Purchase information has been sent to the provided email
				</p>
			</div>
			<div
				v-if="purchase"
				class="flex gap-3 px-6 py-5 rounded-xl bg-white shadow-lg"
			>
				<img
					:src="purchase?.data.ticket.offering.banner[0]"
					class="w-24 h-16 rounded-xl object-cover object-center"
				/>
				<div class="flex flex-col">
					<span
						class="text-green-700 capitalize font-semibold text-sm"
						:class="activityColorClass(purchase?.data.ticket.offering.activity)"
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
						{{ purchase?.data.ticket.offering.location[0] }}
					</span>
				</div>
			</div>
			<div v-if="purchase" class="flex gap-2 items-center">
				<span class="font-semibold">Purchase id:</span>
				<span class="bg-gray-200 border-gray-300 border p-2 py-1 rounded-md">
					<pre>{{ purchase.data.paymentId }}</pre>
				</span>
			</div>
		</div>
	</MainContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { activityColorClass } from '~/helpers'
import { dateString } from '~/lib/utils'

export default defineComponent({
	name: 'SuccessPage',
})
</script>
<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const { payment_intent } = route.query

const { data: purchase } = useFetch(`/api/purchase/${payment_intent}`)

if (!purchase) router.push('/')
</script>
