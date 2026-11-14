import { PractitionerRepo } from '~/server/domains/offering'
import { toPractitionerDto } from '~/server/domains/user'
import type { IPractitionerResponse } from '~/server/types'

export default defineEventHandler(async (event) => {
	const { studio_id } = await readBody(event)

	const studioPractitioners = (await PractitionerRepo.findManyByStudioId(studio_id, {
		include: {
			user: true,
		},
	})) as unknown as IPractitionerResponse[]

	return {
		data: studioPractitioners.map((practitioner) =>
			toPractitionerDto(practitioner.user)
		),
		status: 'Success!',
	}
})
