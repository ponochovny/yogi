<template>
	<MainContainer>
		<form class="py-6 md:py-10" @submit.prevent="handleSubmitStripeForm">
			<div class="mb-4 md:mb-8">
				<span class="text-2xl md:text-3xl font-semibold">Checkout</span>
			</div>
			<div class="flex gap-2 md:gap-3 flex-col lg:flex-row">
				<div
					class="bg-white rounded-xl py-8 px-6 sm:px-10 flex flex-1 flex-col gap-8"
				>
					<div class="flex flex-col gap-4 max-w-[400px]">
						<p class="font-semibold text-lg">Personal details</p>
						<Input label="Full name" name="name" v-model="formData.name" />
						<Input label="Email" name="email" v-model="formData.email" />
						<Button
							class="self-start"
							variant="outline"
							:disabled="loading || true"
						>
							<span class="font-semibold">+ Add a person</span>
						</Button>
					</div>
					<div class="flex flex-col gap-4">
						<p class="font-semibold text-lg">
							Payment (Testing mode)
							<span class="font-normal text-xs">
								{{ loading && !error ? 'Please wait. Loading...' : '' }}
								<pre>{{ error }}</pre>
							</span>
						</p>
						<div class="max-w-[400px]">
							<div id="payment-element" class="mb-2"></div>
						</div>
					</div>
				</div>
				<div
					class="flex flex-col gap-2 md:gap-3 lg:min-w-[400px] w-full lg:w-1/3"
				>
					<div v-if="data" class="bg-white rounded-xl py-4 px-6">
						<div class="flex gap-3">
							<NuxtImg
								:src="offeringBanner()"
								class="w-24 h-16 rounded-xl object-cover object-center"
								provider="cloudinary"
								width="100"
								height="auto"
								format="webp"
							/>
							<div class="flex flex-col">
								<span
									class="capitalize font-bold text-sm"
									:class="{
										'text-blue-500/90':
											data?.data.offering?.activity.toLowerCase() === 'class',
										'text-red-400':
											data?.data.offering?.activity.toLowerCase() === 'event',
										'text-yellow-500':
											data?.data.offering?.activity.toLowerCase() ===
											'appointment',
									}"
								>
									{{ data?.data.offering?.activity }}
								</span>
								<NuxtLink :to="'/offering/' + data?.data.offering?.slug">
									<span class="font-semibold">
										{{ data?.data.offering?.name }}
									</span>
								</NuxtLink>
								<span class="font-semibold text-sm text-gray-600">
									{{
										dateString(
											data?.data.offering?.start || '',
											data?.data.offering?.end || ''
										)
									}}
								</span>
								<span class="font-semibold text-sm">
									{{ data?.data.offering?.location?.name }}
								</span>
							</div>
						</div>
					</div>
					<!-- <div class="bg-white rounded-xl py-4 px-6">Promo code</div> -->
					<div class="bg-white rounded-xl py-4 px-6 flex flex-col gap-2">
						<!-- Price/Fee/Total(with fee) -->
						<p class="font-semibold">Purchase</p>
						<div class="flex justify-between">
							<span>{{ count }}x {{ data?.data.name }}</span>
							<span class="font-semibold">
								{{ `${data?.data.price}` }}
							</span>
						</div>
						<hr />
						<div class="flex justify-between mb-4">
							<p class="font-semibold">Total</p>
							<p>
								<span class="font-semibold">
									{{ `${data?.data.price}` }}
								</span>
							</p>
						</div>
						<Button
							class="text-white font-semibold w-full"
							type="submit"
							:disabled="loading"
						>
							<span class="mx-auto">Confirm pay</span>
						</Button>
					</div>

					<!-- <div class="bg-white rounded-xl py-4 px-6"> -->
					<!-- <p class="font-semibold">Terms & Conditions</p>
						<div>[Checkbox] I Agree to Terms of ...</div> -->
					<!-- <Button
							class="text-white font-semibold w-full"
							type="submit"
							:disabled="loading"
						>
							<span class="mx-auto">Confirm pay</span>
						</Button>
					</div> -->
				</div>
			</div>
		</form>
		<!-- <Button @click="refetch({ amount: 1900, currency: 'usd' })">Refetch</Button> -->
	</MainContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { convertPriceStringToNumber } from '~/helpers'
import type { TTicket } from '~/helpers/types/ticket'
import { dateString } from '~/lib/utils'

export default defineComponent({
	name: 'CheckoutPage',
})
</script>
<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const { count, ticketId } = route.query

const { data } = await useFetch<{ data: TTicket }>(`/api/ticket/${ticketId}`)

if (!data) {
	router.push('/')
}

const _data = reactive({
	amount: convertPriceStringToNumber(data.value?.data.price.toString() || ''),
	currency: data.value?.data.currency || '',
})

// > TESTING STRIPE >
const {
	injectStripe,
	handleSubmitStripeForm,
	// refetch,
	error,
	loading,
} = useStripe('#payment-element', {
	amount: _data.amount,
	currency: _data.currency,
	ticket_id: (ticketId as string) || '',
})

const { useAuthUser } = useAuth()
const user = useAuthUser()

const formData = reactive({
	name: user.value?.name || '',
	email: user.value?.email || '',
})

watch(user, (val) => {
	if (val) {
		formData.name = val.name || ''
		formData.email = val.email
	}
})

onMounted(() => injectStripe())
// < TESTING STRIPE <

function offeringBanner() {
	if (
		data.value?.data?.offering?.banner &&
		data.value?.data?.offering?.banner[0]
	) {
		return data.value?.data?.offering?.banner[0]
	}
	return 'img/banner-placeholder2.jpeg'
}

useSeoMeta({
	title: 'Checkout',
	ogTitle: 'Checkout',
	description: '',
	ogDescription: '',
	ogImage: 'logoBg.png',
	twitterCard: 'summary',
})
</script>
