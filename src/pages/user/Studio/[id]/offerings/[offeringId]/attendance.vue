<template>
	<NuxtLayout name="user-admin">
		<div class="mx-auto max-w-5xl space-y-6 pb-12 pt-4">
			<!-- Header & Navigation -->
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<div class="flex items-center gap-2 text-xs text-muted-foreground">
						<NuxtLink :to="`/user/Studio/${studioId}/offerings`" class="hover:underline">
							Offerings
						</NuxtLink>
						<span>/</span>
						<span>Attendance Check-in</span>
					</div>
					<h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
						{{ rosterData?.offering?.name || 'Class Attendance' }}
					</h1>
					<p class="text-sm text-muted-foreground">
						Scan attendee QR codes or mark attendance manually. Works fully offline.
					</p>
				</div>

				<!-- Connection & Sync Controls -->
				<div class="flex flex-wrap items-center gap-2">
					<!-- Online/Offline Badge -->
					<div
						class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
						:class="isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'"
					>
						<span
							class="h-2 w-2 rounded-full"
							:class="isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'"
						/>
						{{ isOnline ? 'Online' : 'Offline Mode' }}
					</div>

					<!-- Pending Sync Button -->
					<button
						v-if="pendingSyncCount > 0"
						type="button"
						class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/20"
						:disabled="!isOnline || isSyncing"
						@click="syncOfflineQueue"
					>
						<RefreshCw class="h-3 w-3" :class="{ 'animate-spin': isSyncing }" />
						Sync {{ pendingSyncCount }} offline
					</button>

					<!-- Refresh Roster -->
					<button
						type="button"
						class="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium shadow-sm transition hover:bg-muted"
						:disabled="!isOnline || isLoading"
						@click="fetchAndCacheRoster"
					>
						<DownloadCloud class="h-3.5 w-3.5" />
						Update Roster
					</button>
				</div>
			</div>

			<!-- Stats Banner -->
			<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
				<div class="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
					<span class="text-xs font-medium text-muted-foreground">Total Bookings</span>
					<div class="mt-1 text-2xl font-bold">{{ totalAttendees }}</div>
				</div>
				<div class="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
					<span class="text-xs font-medium text-emerald-600">Checked In</span>
					<div class="mt-1 text-2xl font-bold text-emerald-600">{{ checkedInCount }}</div>
				</div>
				<div class="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
					<span class="text-xs font-medium text-amber-600">Pending Arrival</span>
					<div class="mt-1 text-2xl font-bold text-amber-600">{{ pendingCount }}</div>
				</div>
				<div class="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
					<span class="text-xs font-medium text-muted-foreground">Attendance Rate</span>
					<div class="mt-1 text-2xl font-bold">{{ attendanceRate }}%</div>
				</div>
			</div>

			<!-- Scanner Viewfinder Box -->
			<div class="overflow-hidden rounded-2xl border bg-card shadow-sm">
				<div class="flex items-center justify-between border-b px-4 py-3 sm:px-6">
					<div class="flex items-center gap-2">
						<QrCode class="h-5 w-5 text-primary" />
						<span class="font-semibold text-sm">QR Code Camera Scanner</span>
					</div>
					<button
						type="button"
						class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition"
						:class="isCameraActive ? 'bg-destructive/10 text-destructive' : 'bg-primary text-primary-foreground'"
						@click="toggleCamera"
					>
						<Camera class="h-3.5 w-3.5" />
						{{ isCameraActive ? 'Stop Camera' : 'Start Camera Scanner' }}
					</button>
				</div>

				<div v-show="isCameraActive" class="relative bg-black flex flex-col items-center justify-center p-4 min-h-[300px]">
					<video
						ref="videoRef"
						autoplay
						playsinline
						muted
						class="max-h-[360px] w-full max-w-md rounded-xl object-cover border-2 border-primary/50"
					/>
					
					<!-- Scanner Reticle Overlay -->
					<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
						<div class="relative h-56 w-56 rounded-2xl border-2 border-primary/80 bg-primary/5">
							<div class="absolute -top-1 -left-1 h-6 w-6 border-t-4 border-l-4 border-primary" />
							<div class="absolute -top-1 -right-1 h-6 w-6 border-t-4 border-r-4 border-primary" />
							<div class="absolute -bottom-1 -left-1 h-6 w-6 border-b-4 border-l-4 border-primary" />
							<div class="absolute -bottom-1 -right-1 h-6 w-6 border-b-4 border-r-4 border-primary" />
							<div class="h-0.5 w-full bg-primary/80 animate-pulse mt-28 shadow-lg shadow-primary" />
						</div>
					</div>

					<p class="mt-3 text-xs text-white/70">
						Point the camera directly at attendee's ticket QR code.
					</p>
				</div>

				<!-- Scan Notification Banner -->
				<div
					v-if="lastScanResult"
					class="flex items-center justify-between px-4 py-3 text-sm transition"
					:class="{
						'bg-emerald-500 text-white': lastScanResult.type === 'SUCCESS',
						'bg-amber-500 text-white': lastScanResult.type === 'WARNING',
						'bg-destructive text-destructive-foreground': lastScanResult.type === 'ERROR',
					}"
				>
					<div class="flex items-center gap-2">
						<CheckCircle2 v-if="lastScanResult.type === 'SUCCESS'" class="h-5 w-5" />
						<AlertTriangle v-else-if="lastScanResult.type === 'WARNING'" class="h-5 w-5" />
						<XCircle v-else class="h-5 w-5" />
						<div>
							<p class="font-bold">{{ lastScanResult.title }}</p>
							<p class="text-xs opacity-90">{{ lastScanResult.detail }}</p>
						</div>
					</div>
					<button
						type="button"
						class="text-xs font-semibold underline"
						@click="lastScanResult = null"
					>
						Dismiss
					</button>
				</div>
			</div>

			<!-- Attendee Roster Section -->
			<div class="rounded-2xl border bg-card p-4 sm:p-6 shadow-sm space-y-4">
				<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<h2 class="text-lg font-bold">Attendee Roster</h2>
					
					<!-- Search Filter -->
					<div class="relative w-full sm:w-72">
						<Search class="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
						<input
							v-model="searchQuery"
							type="text"
							placeholder="Search by name or email..."
							class="w-full rounded-lg border bg-background pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
						/>
					</div>
				</div>

				<!-- Table of Attendees -->
				<div class="overflow-x-auto">
					<table class="w-full text-left text-sm">
						<thead class="border-b text-xs font-semibold text-muted-foreground">
							<tr>
								<th class="pb-3 pl-2">Attendee</th>
								<th class="pb-3">Ticket</th>
								<th class="pb-3">Status</th>
								<th class="pb-3">Check-in Time</th>
								<th class="pb-3 pr-2 text-right">Action</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-border">
							<tr
								v-for="attendee in filteredRoster"
								:key="attendee.purchaseId"
								class="hover:bg-muted/40 transition"
							>
								<!-- Name & Email -->
								<td class="py-3 pl-2 font-medium">
									<div class="flex items-center gap-2.5">
										<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs uppercase">
											{{ attendee.name.substring(0, 2) }}
										</div>
										<div>
											<p class="text-foreground">{{ attendee.name }}</p>
											<p class="text-xs text-muted-foreground">{{ attendee.email }}</p>
										</div>
									</div>
								</td>

								<!-- Ticket -->
								<td class="py-3">
									<span class="inline-block rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
										{{ attendee.ticketName }}
									</span>
								</td>

								<!-- Status -->
								<td class="py-3">
									<span
										class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
										:class="
											attendee.isCheckedIn
												? 'bg-emerald-100 text-emerald-800'
												: 'bg-muted text-muted-foreground'
										"
									>
										<span
											class="h-1.5 w-1.5 rounded-full"
											:class="attendee.isCheckedIn ? 'bg-emerald-500' : 'bg-muted-foreground'"
										/>
										{{ attendee.isCheckedIn ? 'Checked In' : 'Pending' }}
									</span>
								</td>

								<!-- Time -->
								<td class="py-3 text-xs text-muted-foreground">
									{{ attendee.checkedInAt ? formatTime(attendee.checkedInAt) : '—' }}
								</td>

								<!-- Manual Check-in Action -->
								<td class="py-3 pr-2 text-right">
									<button
										v-if="!attendee.isCheckedIn"
										type="button"
										class="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground transition"
										@click="checkInAttendeeManually(attendee)"
									>
										<Check class="h-3.5 w-3.5" />
										Check In
									</button>
									<span v-else class="text-xs text-emerald-600 font-medium">
										Confirmed
									</span>
								</td>
							</tr>
							<tr v-if="filteredRoster.length === 0">
								<td colspan="5" class="py-8 text-center text-sm text-muted-foreground">
									{{ searchQuery ? 'No attendees match your search query.' : 'No confirmed attendees yet.' }}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</NuxtLayout>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
	AlertTriangle,
	Camera,
	Check,
	CheckCircle2,
	DownloadCloud,
	QrCode,
	RefreshCw,
	Search,
	XCircle,
} from 'lucide-vue-next'
import { AttendanceIdb, type IOfflineRosterItem } from '~/src/shared/lib/attendanceIdb'

const route = useRoute()
const studioId = computed(() => (route.params.id as string) || '')
const offeringId = computed(() => (route.params.offeringId as string) || '')

const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)
const isLoading = ref(false)
const isSyncing = ref(false)
const searchQuery = ref('')
const roster = ref<IOfflineRosterItem[]>([])
const pendingSyncCount = ref(0)
const rosterData = ref<any>(null)

// Camera & Scanner State
const isCameraActive = ref(false)
const videoRef = ref<HTMLVideoElement | null>(null)
let mediaStream: MediaStream | null = null
let animationFrameId: number | null = null

interface IScanAlert {
	type: 'SUCCESS' | 'WARNING' | 'ERROR'
	title: string
	detail: string
}
const lastScanResult = ref<IScanAlert | null>(null)

// Computed Roster Stats
const totalAttendees = computed(() => roster.value.length)
const checkedInCount = computed(() => roster.value.filter((r) => r.isCheckedIn).length)
const pendingCount = computed(() => totalAttendees.value - checkedInCount.value)
const attendanceRate = computed(() => {
	if (totalAttendees.value === 0) return 0
	return Math.round((checkedInCount.value / totalAttendees.value) * 100)
})

const filteredRoster = computed(() => {
	const query = searchQuery.value.trim().toLowerCase()
	if (!query) return roster.value
	return roster.value.filter(
		(r) => r.name.toLowerCase().includes(query) || r.email.toLowerCase().includes(query)
	)
})

const formatTime = (isoString: string) => {
	try {
		const date = new Date(isoString)
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	} catch {
		return isoString
	}
}

// Fetch roster manifest from server and save into IndexedDB
const fetchAndCacheRoster = async () => {
	if (!isOnline.value) return
	try {
		isLoading.value = true
		const response = await $fetch<{ success: boolean; data: any }>(
			`/api/attendance/roster?offeringId=${offeringId.value}`
		)
		if (response?.data?.roster) {
			rosterData.value = response.data
			await AttendanceIdb.saveRoster(offeringId.value, response.data.roster)
			roster.value = response.data.roster
		}
	} catch (err: any) {
		console.warn('Could not refresh roster online, using local cache:', err)
	} finally {
		isLoading.value = false
		await refreshPendingSyncCount()
	}
}

// Load cached roster from IndexedDB on page load
const loadCachedRoster = async () => {
	const cached = await AttendanceIdb.getRoster(offeringId.value)
	if (cached && cached.length > 0) {
		roster.value = cached
	}
	await refreshPendingSyncCount()
}

const refreshPendingSyncCount = async () => {
	const queue = await AttendanceIdb.getPendingQueue(offeringId.value)
	pendingSyncCount.value = queue.length
}

// Sync pending offline queue to server
const syncOfflineQueue = async () => {
	if (!isOnline.value || isSyncing.value) return
	try {
		isSyncing.value = true
		const queue = await AttendanceIdb.getPendingQueue(offeringId.value)
		if (!queue.length) return

		const payload = {
			offeringId: offeringId.value,
			items: queue,
		}

		const response = await $fetch<{ success: boolean; data: any }>('/api/attendance/sync-batch', {
			method: 'POST',
			body: payload,
		})

		if (response?.data) {
			const syncedIds = queue.map((q) => q.purchaseId)
			await AttendanceIdb.clearSyncedRecords(syncedIds)
			await refreshPendingSyncCount()
			lastScanResult.value = {
				type: 'SUCCESS',
				title: 'Offline Sync Complete',
				detail: `Synchronized ${response.data.syncedCount} check-in records to server.`,
			}
		}
	} catch (err: any) {
		lastScanResult.value = {
			type: 'ERROR',
			title: 'Sync Failed',
			detail: err?.data?.statusMessage || 'Network error during synchronization.',
		}
	} finally {
		isSyncing.value = false
	}
}

// Manual check-in from roster table
const checkInAttendeeManually = async (attendee: IOfflineRosterItem) => {
	await AttendanceIdb.markLocalCheckIn({
		purchaseId: attendee.purchaseId,
		offeringId: offeringId.value,
		deviceId: 'manual-manager-device',
	})

	attendee.isCheckedIn = true
	attendee.checkedInAt = new Date().toISOString()
	await refreshPendingSyncCount()

	if (isOnline.value) {
		syncOfflineQueue()
	}

	lastScanResult.value = {
		type: 'SUCCESS',
		title: 'Checked In',
		detail: `${attendee.name} marked as present.`,
	}
}

// QR Code Processing
const processScannedToken = async (rawText: string) => {
	try {
		let tokenStr = rawText.trim()
		if (tokenStr.startsWith('YOGI:')) {
			tokenStr = tokenStr.slice(5)
		}
		const jsonStr = atob(tokenStr.replace(/-/g, '+').replace(/_/g, '/'))
		const payload = JSON.parse(jsonStr)

		if (!payload || !payload.pId || !payload.sig) {
			throw new Error('Unrecognized QR token')
		}

		if (payload.oId !== offeringId.value) {
			lastScanResult.value = {
				type: 'ERROR',
				title: 'Wrong Offering',
				detail: 'This ticket is for a different event or class.',
			}
			return
		}

		// Look up in local roster
		const localAttendee = await AttendanceIdb.getAttendee(payload.pId)
		if (!localAttendee) {
			// If online, fallback to server check
			if (isOnline.value) {
				const serverCheck = await $fetch<{ success: boolean; data: any }>('/api/attendance/scan', {
					method: 'POST',
					body: {
						rawScannedText: rawText,
						offeringId: offeringId.value,
					},
				})
				if (serverCheck?.data?.status === 'CHECKED_IN') {
					lastScanResult.value = {
						type: 'SUCCESS',
						title: 'Check-In Confirmed',
						detail: `Welcome, ${serverCheck.data.attendee.name}!`,
					}
					await fetchAndCacheRoster()
					return
				}
			}
			lastScanResult.value = {
				type: 'ERROR',
				title: 'Ticket Not Found',
				detail: 'Purchase record not found in event roster.',
			}
			return
		}

		// Validate cryptographic signature
		if (localAttendee.expectedSig !== payload.sig) {
			lastScanResult.value = {
				type: 'ERROR',
				title: 'Invalid Ticket Signature',
				detail: 'Cryptographic signature mismatch. Counterfeit ticket detected.',
			}
			return
		}

		// Check if already checked in
		if (localAttendee.isCheckedIn) {
			lastScanResult.value = {
				type: 'WARNING',
				title: 'Already Checked In',
				detail: `${localAttendee.name} was already checked in at ${formatTime(localAttendee.checkedInAt || '')}.`,
			}
			return
		}

		// Check-in success!
		await AttendanceIdb.markLocalCheckIn({
			purchaseId: localAttendee.purchaseId,
			offeringId: offeringId.value,
			deviceId: 'camera-pwa-scanner',
		})

		localAttendee.isCheckedIn = true
		localAttendee.checkedInAt = new Date().toISOString()

		// Trigger haptic vibration feedback
		if (typeof navigator !== 'undefined' && navigator.vibrate) {
			navigator.vibrate([100, 50, 100])
		}

		lastScanResult.value = {
			type: 'SUCCESS',
			title: 'Check-In Confirmed',
			detail: `Welcome, ${localAttendee.name}! (${localAttendee.ticketName})`,
		}

		await refreshPendingSyncCount()

		if (isOnline.value) {
			syncOfflineQueue()
		}
	} catch (err: any) {
		lastScanResult.value = {
			type: 'ERROR',
			title: 'Scan Error',
			detail: err?.message || 'Failed to parse QR code.',
		}
	}
}

// Camera Scanner lifecycle
const toggleCamera = async () => {
	if (isCameraActive.value) {
		stopCamera()
	} else {
		await startCamera()
	}
}

const startCamera = async () => {
	try {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			mediaStream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'environment' },
			})
			if (videoRef.value) {
				videoRef.value.srcObject = mediaStream
				isCameraActive.value = true
				startFrameScanning()
			}
		}
	} catch (err: any) {
		alert('Could not access camera: ' + err.message)
	}
}

const stopCamera = () => {
	if (animationFrameId) {
		cancelAnimationFrame(animationFrameId)
		animationFrameId = null
	}
	if (mediaStream) {
		mediaStream.getTracks().forEach((track) => track.stop())
		mediaStream = null
	}
	isCameraActive.value = false
}

let lastScannedText = ''
let lastScanTimestamp = 0

const startFrameScanning = () => {
	const detectBarcode = async () => {
		if (!isCameraActive.value || !videoRef.value) return

		// Use native BarcodeDetector API if available
		if ('BarcodeDetector' in window) {
			try {
				const barcodeDetector = new (window as any).BarcodeDetector({ formats: ['qr_code'] })
				const barcodes = await barcodeDetector.detect(videoRef.value)
				if (barcodes.length > 0) {
					const scannedValue = barcodes[0].rawValue
					const now = Date.now()
					// Debounce scans by 3 seconds for the same code
					if (scannedValue !== lastScannedText || now - lastScanTimestamp > 3000) {
						lastScannedText = scannedValue
						lastScanTimestamp = now
						await processScannedToken(scannedValue)
					}
				}
			} catch (e) {
				// Continue scan loop
			}
		}

		if (isCameraActive.value) {
			animationFrameId = requestAnimationFrame(detectBarcode)
		}
	}

	animationFrameId = requestAnimationFrame(detectBarcode)
}

const handleOnlineState = () => {
	isOnline.value = true
	syncOfflineQueue()
}

const handleOfflineState = () => {
	isOnline.value = false
}

onMounted(async () => {
	window.addEventListener('online', handleOnlineState)
	window.addEventListener('offline', handleOfflineState)

	await loadCachedRoster()
	if (isOnline.value) {
		await fetchAndCacheRoster()
	}
})

onUnmounted(() => {
	stopCamera()
	window.removeEventListener('online', handleOnlineState)
	window.removeEventListener('offline', handleOfflineState)
})

useSeoMeta({
	title: 'Attendance Check-in Scanner - Yogi Studio',
})
</script>

