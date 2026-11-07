import type { TStudio } from '~/src/app/types/studio'
import type { IUserResponse } from '~/server/types'
import type { IStudioResponse } from '~/server/types/studio'
import { toMediaFileDto } from '~/server/domains/offering/transformers/mediaFile.dto'
import { toOwnerDto, toPractitionerDto } from '~/server/domains/user'

export const toStudioDto = (studio: IStudioResponse): TStudio => {
	const { createdAt, updatedAt, ownerId, ...rest } = studio

	let parsedLocation = studio.location
	if (typeof studio.location === 'string') {
		try {
			parsedLocation = JSON.parse(studio.location)
		} catch {
			parsedLocation = {
				name: studio.location,
				coords: [0, 0],
			}
		}
	}

	return {
		...rest,
		logo:
			studio.logo && studio.logo.length
				? Array.of(studio.logo[studio.logo.length - 1]).map(toMediaFileDto)[0]
				: { url: '' },
		banner:
			studio.banner && studio.banner.length
				? Array.of(studio.banner[studio.banner.length - 1]).map(toMediaFileDto)
				: [],
		...(studio.owner && {
			owner: toOwnerDto(studio.owner as IUserResponse & { _id: string }),
		}),
		practitioners: studio.practitioners
			? studio.practitioners.map((data) => toPractitionerDto(data.user))
			: [],
		location: parsedLocation,
	}
}

