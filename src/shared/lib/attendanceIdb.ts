/**
 * Typed IndexedDB storage for Offline-First Attendance Roster and Sync Queue
 */

export interface IOfflineRosterItem {
	purchaseId: string
	ticketId: string
	ticketName: string
	name: string
	email: string
	avatarUrl: string | null
	expectedSig: string
	isCheckedIn: boolean
	checkedInAt: string | null
}

export interface IOfflineSyncQueueItem {
	id?: number
	purchaseId: string
	offeringId: string
	clientScanTime: string
	deviceId?: string
	sessionDate?: string
}

const DB_NAME = 'yogi_offline_attendance_db'
const DB_VERSION = 1
const ROSTER_STORE = 'rosters'
const SYNC_QUEUE_STORE = 'sync_queue'

function openDatabase(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		if (typeof window === 'undefined' || !window.indexedDB) {
			reject(new Error('IndexedDB not supported in this environment'))
			return
		}

		const request = window.indexedDB.open(DB_NAME, DB_VERSION)

		request.onerror = () => reject(request.error)
		request.onsuccess = () => resolve(request.result)

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result
			if (!db.objectStoreNames.contains(ROSTER_STORE)) {
				const rosterStore = db.createObjectStore(ROSTER_STORE, { keyPath: 'purchaseId' })
				rosterStore.createIndex('offeringId', 'offeringId', { unique: false })
			}
			if (!db.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
				const queueStore = db.createObjectStore(SYNC_QUEUE_STORE, {
					keyPath: 'id',
					autoIncrement: true,
				})
				queueStore.createIndex('offeringId', 'offeringId', { unique: false })
			}
		}
	})
}

export const AttendanceIdb = {
	/**
	 * Pre-cache full offering roster for offline use
	 */
	async saveRoster(offeringId: string, items: IOfflineRosterItem[]): Promise<void> {
		const db = await openDatabase()
		return new Promise((resolve, reject) => {
			const tx = db.transaction([ROSTER_STORE], 'readwrite')
			const store = tx.objectStore(ROSTER_STORE)

			for (const item of items) {
				store.put({ ...item, offeringId })
			}

			tx.oncomplete = () => resolve()
			tx.onerror = () => reject(tx.error)
		})
	},

	/**
	 * Get cached roster for an offering
	 */
	async getRoster(offeringId: string): Promise<IOfflineRosterItem[]> {
		const db = await openDatabase()
		return new Promise((resolve, reject) => {
			const tx = db.transaction([ROSTER_STORE], 'readonly')
			const store = tx.objectStore(ROSTER_STORE)
			const index = store.index('offeringId')
			const request = index.getAll(IDBKeyRange.only(offeringId))

			request.onsuccess = () => resolve(request.result || [])
			request.onerror = () => reject(request.error)
		})
	},

	/**
	 * Lookup single attendee by purchase ID in local storage
	 */
	async getAttendee(purchaseId: string): Promise<IOfflineRosterItem | null> {
		const db = await openDatabase()
		return new Promise((resolve, reject) => {
			const tx = db.transaction([ROSTER_STORE], 'readonly')
			const store = tx.objectStore(ROSTER_STORE)
			const request = store.get(purchaseId)

			request.onsuccess = () => resolve(request.result || null)
			request.onerror = () => reject(request.error)
		})
	},

	/**
	 * Mark attendee checked in locally and enqueue for sync
	 */
	async markLocalCheckIn(params: {
		purchaseId: string
		offeringId: string
		deviceId?: string
		sessionDate?: string
	}): Promise<void> {
		const db = await openDatabase()
		const now = new Date().toISOString()

		return new Promise((resolve, reject) => {
			const tx = db.transaction([ROSTER_STORE, SYNC_QUEUE_STORE], 'readwrite')
			const rosterStore = tx.objectStore(ROSTER_STORE)
			const queueStore = tx.objectStore(SYNC_QUEUE_STORE)

			const getReq = rosterStore.get(params.purchaseId)
			getReq.onsuccess = () => {
				const item = getReq.result
				if (item) {
					item.isCheckedIn = true
					item.checkedInAt = now
					rosterStore.put(item)
				}

				queueStore.add({
					purchaseId: params.purchaseId,
					offeringId: params.offeringId,
					clientScanTime: now,
					deviceId: params.deviceId,
					sessionDate: params.sessionDate,
				})
			}

			tx.oncomplete = () => resolve()
			tx.onerror = () => reject(tx.error)
		})
	},

	/**
	 * Get pending offline sync queue
	 */
	async getPendingQueue(offeringId?: string): Promise<IOfflineSyncQueueItem[]> {
		const db = await openDatabase()
		return new Promise((resolve, reject) => {
			const tx = db.transaction([SYNC_QUEUE_STORE], 'readonly')
			const store = tx.objectStore(SYNC_QUEUE_STORE)

			let request: IDBRequest
			if (offeringId) {
				const index = store.index('offeringId')
				request = index.getAll(IDBKeyRange.only(offeringId))
			} else {
				request = store.getAll()
			}

			request.onsuccess = () => resolve(request.result || [])
			request.onerror = () => reject(request.error)
		})
	},

	/**
	 * Clear successfully synced records from queue
	 */
	async clearSyncedRecords(purchaseIds: string[]): Promise<void> {
		if (!purchaseIds.length) return
		const db = await openDatabase()

		return new Promise((resolve, reject) => {
			const tx = db.transaction([SYNC_QUEUE_STORE], 'readwrite')
			const store = tx.objectStore(SYNC_QUEUE_STORE)
			const req = store.openCursor()

			req.onsuccess = (event) => {
				const cursor = (event.target as IDBRequest).result
				if (cursor) {
					if (purchaseIds.includes(cursor.value.purchaseId)) {
						cursor.delete()
					}
					cursor.continue()
				}
			}

			tx.oncomplete = () => resolve()
			tx.onerror = () => reject(tx.error)
		})
	},
}

