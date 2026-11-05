import { offeringDataCreationSchema } from '~/src/app/types/offering'
import { OfferingService } from '~/server/domains/offering'
import { extractForm } from '~/server/domains/shared'

const parseArrayField = (fields: { [key: string]: string }, field: string) => {
	const fieldKey = field + '[]'
	const isSingleTicket = typeof fields[fieldKey] === 'string'

	let result
	try {
		result = JSON.parse(fields[fieldKey])
	} catch {
		result = fields[fieldKey]
	}
	if (isSingleTicket) return [result]

	return (fields[fieldKey] as unknown as string[])?.map((ticket) => {
		try {
			return JSON.parse(ticket)
		} catch {
			return ticket
		}
	})
}

export default defineEventHandler(async (event) => {
	const { fields, files } = await extractForm<{
		fields: { [key: string]: string } & { studioId: string }
		files: any
	}>(event)

	const studioId = fields.studioId

	const offeringData = {
		name: fields.name,
		description: fields.description,
		activity: fields.activity,
		slug: fields.name,
		types: fields.types.split(','),
		categories: fields.categories.split(','),
		duration: +fields.duration,
		spots: +fields.spots,
		location: JSON.parse(fields.location as unknown as string),
		timezone: fields.timezone,
		start: new Date(fields.start),
		end: new Date(fields.end),
		is_private: fields.is_private === 'true',
		isActive: false,
		tickets: parseArrayField(fields, 'tickets'),
		practitioners: parseArrayField(fields, 'practitioners'),
		banners: files[`fileToUpload[]`] || [],
		studioId,
	}

	const parsed = offeringDataCreationSchema.safeParse(offeringData)
	if (!parsed.success) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Data is not valid',
		})
	}

	const { banners, practitioners, tickets, location, ...restOfferingData } =
		offeringData

	return OfferingService.createOffering(
		{ ...restOfferingData, location: JSON.stringify(location) },
		{ tickets, practitioners, banners }
	)
})
