import { getPractitionersByStudioID } from '~/server/db/practitioners'
import { practitionerTransformer } from '~/server/transformers/user'
import type { IPractitionerResponse } from '~/server/types'

export default defineEventHandler(async (event) => {
	const { studio_id } = await readBody(event)

	const studioPractitioners = (await getPractitionersByStudioID(studio_id, {
		include: {
			user: true,
		},
	})) as unknown as IPractitionerResponse[]

	return {
		data: studioPractitioners.map((practitioner) =>
			practitionerTransformer(practitioner.user)
		),
		status: 'Success!',
	}
})
