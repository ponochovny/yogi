import { offeringDataCreationSchema } from '~/src/app/types/offering'
import { OfferingService } from '~/server/domains/offering'
import { extractForm, requireFormField } from '~/server/domains/shared'

const parseArrayField = (
	fields: Record<string, string | string[] | undefined>,
	field: string
) => {
	const fieldKey = field + '[]'
	const value = fields[fieldKey]
	if (value === undefined) return []

	const parseValue = (item: string) => {
		try {
			return JSON.parse(item)
		} catch {
			return item
		}
	}

	if (Array.isArray(value)) return value.map(parseValue)

	const parsed = parseValue(value)
	return Array.isArray(parsed) ? parsed : [parsed]
}

export default defineEventHandler(async (event) => {
	const { fields, files } = await extractForm<{
		fields: Record<string, string | string[] | undefined>
		files: any
	}>(event)

	const uploadedBanners = files['fileToUpload[]']
	const bannerFiles = Array.isArray(uploadedBanners)
		? uploadedBanners
		: uploadedBanners
			? [uploadedBanners]
			: []

	const offeringData = {
		name: requireFormField(fields, 'name'),
		description: requireFormField(fields, 'description'),
		activity: requireFormField(fields, 'activity'),
		slug: requireFormField(fields, 'name'),
		types: requireFormField(fields, 'types').split(','),
		categories: requireFormField(fields, 'categories').split(','),
		duration: +requireFormField(fields, 'duration'),
		spots: +requireFormField(fields, 'spots'),
		location: JSON.parse(requireFormField(fields, 'location')),
		timezone: requireFormField(fields, 'timezone'),
		start: new Date(requireFormField(fields, 'start')),
		end: new Date(requireFormField(fields, 'end')),
		is_private: requireFormField(fields, 'is_private') === 'true',
		isActive: false,
		tickets: parseArrayField(fields, 'tickets'),
		practitioners: parseArrayField(fields, 'practitioners'),
		banners: bannerFiles,
		studioId: requireFormField(fields, 'studioId'),
	}

	const parsed = offeringDataCreationSchema.safeParse(offeringData)
	if (!parsed.success) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Data is not valid',
		})
	}

	const { practitioners, tickets, location, ...restOfferingData } = parsed.data

	return OfferingService.createOffering(
		{ ...restOfferingData, location: JSON.stringify(location) },
		{ tickets, practitioners, banners: bannerFiles }
	)
})
