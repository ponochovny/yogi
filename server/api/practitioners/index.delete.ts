import { removePractitioner } from '~/server/db/practitioners'

export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	const promises = body.map(
		(practitioner: { id: string; offeringId: string }) => {
			const id = practitioner.id
			const offeringId = practitioner.offeringId
			return removePractitioner({
				where: {
					id,
					offeringId,
				},
			})
		}
	)

	const res = await Promise.all(promises)
})
