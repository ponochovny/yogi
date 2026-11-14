<template>
	<MainContainer>
		<div class="mx-auto flex max-w-xl flex-col items-center gap-6 py-8 sm:gap-8 sm:py-12">
			<!-- Header Status -->
			<div class="flex flex-col items-center gap-2 text-center">
				<div class="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
					<CheckCircle2 class="h-8 w-8" />
				</div>
				<h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
					{{ purchaseData ? 'Booking Confirmed!' : 'Verifying your payment...' }}
				</h1>
				<p class="max-w-md text-sm text-muted-foreground">
					{{
						purchaseData?.receiptEmail
							? `Confirmation and ticket details have been sent to ${purchaseData.receiptEmail}`
							: 'Please keep this page open while we prepare your ticket.'
					}}
				</p>
			</div>

			<!-- QR Ticket Pass Card -->
			<div
				v-if="purchaseData?.ticket && purchaseData.ticket.offering"
				class="w-full overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-lg"
			>
				<!-- Offering Header Image -->
				<div class="relative h-44 w-full bg-muted sm:h-52">
					<img
						:src="offeringBannerUrl"
						:alt="purchaseData.ticket.offering.name"
						class="h-full w-full object-cover"
					/>
					<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
					<div class="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
						<div>
							<span
								class="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize backdrop-blur-md"
								:class="{
									'bg-blue-500/80': purchaseData.ticket.offering.activity.toLowerCase() === 'class',
									'bg-rose-500/80': purchaseData.ticket.offering.activity.toLowerCase() === 'event',
									'bg-amber-500/80':
										purchaseData.ticket.offering.activity.toLowerCase() === 'appointment',
								}"
							>
								{{ purchaseData.ticket.offering.activity }}
							</span>
							<h2 class="mt-1 text-lg font-bold sm:text-xl">
								{{ purchaseData.ticket.offering.name }}
							</h2>
						</div>
					</div>
				</div>

				<!-- Ticket Body & QR Section -->
				<div class="flex flex-col items-center p-6 text-center sm:p-8">
					<!-- Date & Location Details -->
					<div class="mb-6 flex w-full flex-col gap-2 rounded-xl bg-muted/40 p-4 text-left text-sm">
						<div class="flex items-center gap-2 text-foreground font-medium">
							<Calendar class="h-4 w-4 text-muted-foreground" />
							<span>{{ dateString(purchaseData.ticket.offering.start, purchaseData.ticket.offering.end) }}</span>
						</div>
						<div class="flex items-center gap-2 text-muted-foreground">
							<MapPin class="h-4 w-4" />
							<span>{{ purchaseData.ticket.offering.location }}</span>
						</div>
						<div class="flex items-center gap-2 text-primary font-semibold">
							<Ticket class="h-4 w-4" />
							<span>
								{{ purchaseData.ticket.name }} ({{ purchaseData.ticket.price }} {{ purchaseData.ticket.currency }})
							</span>
						</div>
					</div>

					<!-- QR Display Box -->
					<div class="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-6">
						<div v-if="qrInfo?.qrDataUrl" class="relative">
							<img
								:src="qrInfo.qrDataUrl"
								alt="Ticket QR Code"
								class="h-56 w-56 rounded-xl bg-white p-2 shadow-sm sm:h-64 sm:w-64"
							/>
							<div
								v-if="qrInfo.isCheckedIn"
								class="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-emerald-950/80 text-white backdrop-blur-sm"
							>
								<CheckCircle2 class="h-12 w-12 text-emerald-400" />
								<span class="mt-2 text-lg font-bold">Checked In</span>
							</div>
						</div>
						<div v-else class="flex h-56 w-56 items-center justify-center">
							<div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
						</div>

						<p class="mt-4 text-xs text-muted-foreground">
							Show this QR code at the entrance. Works offline as a screenshot or printout.
						</p>
					</div>

					<!-- Actions -->
					<div class="mt-6 flex flex-wrap items-center justify-center gap-3">
						<button
							type="button"
							class="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-muted active:scale-95"
							@click="printTicket"
						>
							<Printer class="h-4 w-4" />
							Print / Save PDF
						</button>
						<NuxtLink
							:to="`/offering/${purchaseData.ticket.offering.slug}`"
							class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition hover:bg-primary/90 active:scale-95"
						>
							View Offering Page
						</NuxtLink>
					</div>
				</div>
			</div>

			<!-- Order Reference -->
			<div v-if="payment_intent" class="text-center text-xs text-muted-foreground">
				<span>Reference ID: </span>
				<code class="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">
					{{ payment_intent }}
				</code>
			</div>
		</div>
	</MainContainer>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Calendar, CheckCircle2, MapPin, Printer, Ticket } from 'lucide-vue-next'
import { dateString } from '~/src/shared/lib/utils'

const route = useRoute()
const payment_intent = computed(() => (route.query.payment_intent as string) || '')

interface IQrApiResponse {
	success: boolean
	data: {
		purchase: any
		token: string
		qrDataUrl: string
		isCheckedIn: boolean
		status: string
	}
}

const { data: qrResponse } = await useFetch<IQrApiResponse>(
	() => `/api/purchase/${payment_intent.value}/qr`,
	{
		immediate: Boolean(payment_intent.value),
		watch: [payment_intent],
	}
)

const qrInfo = computed(() => qrResponse.value?.data)
const purchaseData = computed(() => qrInfo.value?.purchase)

const offeringBannerUrl = computed(() => {
	const banners = purchaseData.value?.ticket?.offering?.banners
	if (banners && banners.length > 0 && banners[0]?.url) {
		return banners[0].url
	}
	return '/img/banner-placeholder2.jpeg'
})

const printTicket = () => {
	if (typeof window !== 'undefined') {
		window.print()
	}
}

useSeoMeta({
	title: 'Booking Confirmed - Yogi',
	description: 'Your booking has been confirmed. Present your ticket QR code at the entrance.',
})
</script>
