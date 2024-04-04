<template>
	<MainContainer>
		<form class="py-10" @submit.prevent="handleSubmitStripeForm">
			<div class="mb-8">
				<span class="text-3xl font-semibold">Checkout</span>
			</div>
			<div class="flex gap-3">
				<div class="bg-white rounded-xl py-8 px-10 flex flex-1 flex-col gap-8">
					<div class="flex flex-col gap-4 max-w-[400px]">
						<p class="font-semibold text-lg">Personal details</p>
						<Input label="Full name" name="name" v-model="formData.name" />
						<Input label="Email" name="email" v-model="formData.email" />
						<Button
							class="self-start"
							variant="primaryOutline"
							btnSize="md2"
							:disabled="loading"
						>
							<span class="font-semibold">+ Add a person</span>
						</Button>
					</div>
					<div class="flex flex-col gap-4">
						<p class="font-semibold text-lg">
							Payment
							<span class="font-normal text-xs">
								{{ loading ? 'Please wait. Loading...' : '' }}
							</span>
						</p>
						<div class="max-w-[400px]">
							<div id="payment-element" class="mb-2"></div>
						</div>
					</div>
				</div>
				<div class="flex flex-col gap-3 w-1/3">
					<div v-if="data" class="bg-white rounded-xl py-4 px-6">
						<div class="flex gap-3">
							<img
								:src="offeringBanner()"
								class="w-24 h-16 rounded-xl object-cover object-center"
							/>
							<div class="flex flex-col">
								<span
									class="capitalize font-bold text-sm"
									:class="{
										'text-cyan-700':
											data?.data.offering.activity.toLowerCase() === 'class',
										'text-red-400':
											data?.data.offering.activity.toLowerCase() === 'event',
										'text-yellow-500':
											data?.data.offering.activity.toLowerCase() ===
											'appointment',
									}"
								>
									{{ data?.data.offering.activity }}
								</span>
								<NuxtLink :to="'/offering/' + data?.data.offering.slug">
									<span class="font-semibold">
										{{ data?.data.offering.name }}
									</span>
								</NuxtLink>
								<span class="font-semibold text-sm text-gray-600">
									{{
										dateString(
											data?.data.offering.start,
											data?.data.offering.end
										)
									}}
								</span>
								<span class="font-semibold text-sm">
									{{ data?.data.offering.location[0] }}
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
								{{
									`${currencySymbolByCode(data?.data.currency || '')}${
										data?.data.price
									}`
								}}
							</span>
						</div>
						<hr />
						<div class="flex justify-between">
							<p class="font-semibold">Total</p>
							<p>
								<span class="font-semibold">
									{{
										`${currencySymbolByCode(data?.data.currency || '')}${
											data?.data.price
										}`
									}}
								</span>
							</p>
						</div>
					</div>

					<div class="bg-white rounded-xl py-4 px-6">
						<!-- <p class="font-semibold">Terms & Conditions</p>
						<div>[Checkbox] I Agree to Terms of ...</div> -->
						<Button
							class="text-white font-semibold w-full"
							type="submit"
							:disabled="loading"
						>
							<span class="mx-auto">Confirm pay</span>
						</Button>
					</div>
				</div>
			</div>
		</form>
		<!-- <Button @click="refetch({ amount: 1900, currency: 'usd' })">Refetch</Button> -->
	</MainContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { convertPriceStringToNumber, currencySymbolByCode } from '~/helpers'
import { dateString } from '~/lib/utils'

export default defineComponent({
	name: 'CheckoutPage',
})
</script>
<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const { count, ticketId } = route.query

const { data } = await useFetch(`/api/ticket/${ticketId}`)

if (!data) {
	router.push('/')
}

const _data = reactive({
	amount: convertPriceStringToNumber(data.value?.data.price || ''),
	currency: data.value?.data.currency || '',
})

// > TESTING STRIPE >
const {
	injectStripe,
	handleSubmitStripeForm,
	// refetch,
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
	const dataBanner = data.value?.data?.offering.banner[0]
	const noBanner = 'img/banner-placeholder2.jpeg'
	return dataBanner || noBanner
}
</script>
