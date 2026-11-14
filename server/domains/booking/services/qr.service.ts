import crypto from 'node:crypto'
import QRCode from 'qrcode'
import { z } from 'zod'
import { PurchaseRepo } from '../repositories/purchase.repo'

export const qrPayloadSchema = z.object({
	v: z.literal(1),
	pId: z.string().min(1),
	oId: z.string().min(1),
	tId: z.string().min(1),
	sig: z.string().min(1),
})

export type TQrPayload = z.infer<typeof qrPayloadSchema>

export interface IVerifyQrResult {
	isValid: boolean
	reason?: string
	purchase?: any
	alreadyCheckedIn?: boolean
	previousCheckInTime?: Date | null
}

const getHmacKey = (qrSecret?: string | null): string => {
	const masterSecret = process.env.NUXT_SESSION_PASSWORD || 'yogi-secure-attendance-salt'
	return `${masterSecret}:${qrSecret || 'default'}`
}

export const QrService = {
	/**
	 * Compute HMAC-SHA256 signature for a ticket purchase
	 */
	computeSignature(purchaseId: string, offeringId: string, ticketId: string, qrSecret?: string | null): string {
		const key = getHmacKey(qrSecret)
		const data = `${purchaseId}:${offeringId}:${ticketId}`
		return crypto.createHmac('sha256', key).update(data).digest('hex').substring(0, 32)
	},

	/**
	 * Create signed QR token string (Base64URL encoded)
	 */
	generateToken(params: {
		purchaseId: string
		offeringId: string
		ticketId: string
		qrSecret?: string | null
	}): string {
		const sig = this.computeSignature(params.purchaseId, params.offeringId, params.ticketId, params.qrSecret)
		const payload: TQrPayload = {
			v: 1,
			pId: params.purchaseId,
			oId: params.offeringId,
			tId: params.ticketId,
			sig,
		}
		const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
		return `YOGI:${encoded}`
	},

	/**
	 * Parse raw scanned string into TQrPayload
	 */
	parseToken(rawScannedText: string): TQrPayload | null {
		try {
			let tokenStr = rawScannedText.trim()
			if (tokenStr.startsWith('YOGI:')) {
				tokenStr = tokenStr.slice(5)
			}
			const jsonStr = Buffer.from(tokenStr, 'base64url').toString('utf8')
			const parsed = JSON.parse(jsonStr)
			const validated = qrPayloadSchema.safeParse(parsed)
			if (!validated.success) {
				return null
			}
			return validated.data
		} catch {
			return null
		}
	},

	/**
	 * Verify token authenticity against DB and check attendance status
	 */
	async verifyToken(rawScannedText: string, expectedOfferingId?: string): Promise<IVerifyQrResult> {
		const payload = this.parseToken(rawScannedText)
		if (!payload) {
			return { isValid: false, reason: 'Invalid QR format or corrupted data' }
		}

		if (expectedOfferingId && payload.oId !== expectedOfferingId) {
			return { isValid: false, reason: 'Ticket is for a different class/event' }
		}

		const purchase = await PurchaseRepo.findById(payload.pId)
		if (!purchase) {
			return { isValid: false, reason: 'Purchase record not found' }
		}

		if (purchase.status === 'REFUNDED' || purchase.status === 'CANCELLED') {
			return { isValid: false, reason: `Ticket is ${purchase.status.toLowerCase()}`, purchase }
		}

		const expectedSig = this.computeSignature(payload.pId, payload.oId, payload.tId, purchase.qrSecret)
		if (payload.sig !== expectedSig) {
			return { isValid: false, reason: 'Cryptographic signature mismatch (counterfeit ticket)' }
		}

		// Check if already checked in
		const existingAttendances = purchase.attendances || []
		const activeCheckIn = existingAttendances.find((a: any) => a.status === 'CHECKED_IN')
		if (activeCheckIn) {
			return {
				isValid: true,
				alreadyCheckedIn: true,
				previousCheckInTime: activeCheckIn.checkedInAt,
				purchase,
			}
		}

		return {
			isValid: true,
			alreadyCheckedIn: false,
			purchase,
		}
	},

	/**
	 * Generate QR Data URL (PNG base64) for client display or emails
	 */
	async generateDataUrl(token: string): Promise<string> {
		return QRCode.toDataURL(token, {
			errorCorrectionLevel: 'M',
			margin: 2,
			width: 320,
			color: {
				dark: '#1e293b',
				light: '#ffffff',
			},
		})
	},

	/**
	 * Generate QR SVG string
	 */
	async generateSvg(token: string): Promise<string> {
		return QRCode.toString(token, {
			type: 'svg',
			errorCorrectionLevel: 'M',
			margin: 2,
			width: 320,
			color: {
				dark: '#1e293b',
				light: '#ffffff',
			},
		})
	},
}

