import { createError } from 'h3'
import { prisma } from '~/server/domains/shared'
import { AttendanceRepo, type IRecordCheckInData } from '../repositories/attendance.repo'
import { PurchaseRepo } from '../repositories/purchase.repo'
import { QrService } from './qr.service'

export const AttendanceService = {
	/**
	 * Verify if a user is authorized to scan tickets for an offering
	 */
	async canUserScanOffering(userId: string, offeringId: string): Promise<boolean> {
		const offering = await prisma.offering.findUnique({
			where: { id: offeringId },
			include: {
				studio: {
					include: {
						staff: true,
					},
				},
				practitioners: true,
			},
		})

		if (!offering) return false

		// 1. Studio owner
		if (offering.studio.ownerId === userId) return true

		// 2. Studio staff (Manager, Instructor, Door Staff)
		const isStaff = offering.studio.staff.some((s) => s.userId === userId)
		if (isStaff) return true

		// 3. Offering practitioner
		const isPractitioner = offering.practitioners.some((p) => p.userId === userId)
		if (isPractitioner) return true

		return false
	},

	/**
	 * Process a live scan from manager camera
	 */
	async processLiveScan(params: {
		rawScannedText: string
		offeringId: string
		scannedByUserId: string
		deviceId?: string
		sessionDate?: string
	}) {
		const isAuthorized = await this.canUserScanOffering(params.scannedByUserId, params.offeringId)
		if (!isAuthorized) {
			throw createError({
				statusCode: 403,
				statusMessage: 'You are not authorized to check in attendees for this offering',
			})
		}

		const verification = await QrService.verifyToken(params.rawScannedText, params.offeringId)
		if (!verification.isValid) {
			throw createError({
				statusCode: 400,
				statusMessage: verification.reason || 'Invalid ticket',
			})
		}

		if (verification.alreadyCheckedIn) {
			return {
				status: 'ALREADY_CHECKED_IN',
				message: 'Attendee was already checked in',
				checkedInAt: verification.previousCheckInTime,
				attendee: {
					name: verification.purchase?.userName || verification.purchase?.user?.name || 'Guest',
					email: verification.purchase?.receiptEmail || verification.purchase?.user?.email,
					ticketName: verification.purchase?.ticket?.name,
				},
			}
		}

		const checkIn = await AttendanceRepo.recordCheckIn({
			purchaseId: verification.purchase.id,
			offeringId: params.offeringId,
			scannedByUserId: params.scannedByUserId,
			checkInMethod: 'QR_SCAN',
			deviceId: params.deviceId,
			sessionDate: params.sessionDate,
		})

		return {
			status: 'CHECKED_IN',
			message: 'Check-in confirmed',
			checkedInAt: checkIn.checkedInAt,
			attendee: {
				name: verification.purchase?.userName || verification.purchase?.user?.name || 'Guest',
				email: verification.purchase?.receiptEmail || verification.purchase?.user?.email,
				ticketName: verification.purchase?.ticket?.name,
			},
		}
	},

	/**
	 * Fetch offline roster manifest for an offering
	 */
	async getOfflineRosterManifest(offeringId: string, requestedByUserId: string) {
		const isAuthorized = await this.canUserScanOffering(requestedByUserId, offeringId)
		if (!isAuthorized) {
			throw createError({
				statusCode: 403,
				statusMessage: 'Unauthorized to download attendee roster',
			})
		}

		const purchases = await PurchaseRepo.findRosterByOfferingId(offeringId)

		// Map to offline-safe manifest
		const roster = purchases.map((p) => {
			const expectedSig = QrService.computeSignature(p.id, offeringId, p.ticketId, p.qrSecret)
			const isCheckedIn = p.attendances && p.attendances.length > 0
			return {
				purchaseId: p.id,
				ticketId: p.ticketId,
				ticketName: p.ticket?.name || 'General Admission',
				name: p.userName || p.user?.name || 'Guest',
				email: p.receiptEmail || p.user?.email || '',
				avatarUrl: p.user?.profileImage || null,
				expectedSig,
				isCheckedIn,
				checkedInAt: isCheckedIn ? p.attendances[0].checkedInAt : null,
			}
		})

		return {
			offeringId,
			totalAttendees: roster.length,
			checkedInCount: roster.filter((r) => r.isCheckedIn).length,
			generatedAt: new Date().toISOString(),
			roster,
		}
	},

	/**
	 * Batch process offline check-in queue
	 */
	async processOfflineSyncBatch(params: {
		offeringId: string
		syncedByUserId: string
		items: Array<IRecordCheckInData & { id?: string }>
	}) {
		const isAuthorized = await this.canUserScanOffering(params.syncedByUserId, params.offeringId)
		if (!isAuthorized) {
			throw createError({
				statusCode: 403,
				statusMessage: 'Unauthorized to sync attendance records',
			})
		}

		const results = await AttendanceRepo.batchSync(params.items, params.syncedByUserId)
		return {
			syncedCount: results.filter((r) => r.status === 'SUCCESS').length,
			duplicateCount: results.filter((r) => r.status === 'DUPLICATE').length,
			failedCount: results.filter((r) => r.status === 'FAILED').length,
			details: results,
		}
	},
}

