import { PractitionerRepo } from '~/server/domains/offering'

export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	const promises = body.map(
		(practitioner: { id: string; offeringId: string }) => {
			const id = practitioner.id
			const offeringId = practitioner.offeringId
			return PractitionerRepo.removeMany({
				where: {
					id,
					offeringId,
				},
			})
		}
	)

	await Promise.all(promises)

	return {
		status: 'Success!',
	}
})
