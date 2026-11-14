import type { TStudio } from '~/src/app/types/studio'
import type { IUserResponse } from '~/server/types'
import type { IStudioResponse } from '~/server/types/studio'
import { toMediaFileDto } from '~/server/domains/offering/transformers/mediaFile.dto'
import { toOwnerDto, toPractitionerDto } from '~/server/domains/user'
import type { TMarker } from '~/src/app/types/map'

export const toStudioDto = (studio: IStudioResponse): TStudio => {
	const { createdAt, updatedAt, ownerId, ...rest } = studio

	let parsedLocation: TMarker = {
		name: studio.location,
		coords: [0, 0],
	}
	if (typeof studio.location === 'string') {
		try {
			const location: unknown = JSON.parse(studio.location)
			const [latitude, longitude] =
				typeof location === 'object' &&
				location !== null &&
				'coords' in location &&
				Array.isArray(location.coords)
					? location.coords
					: []
			if (
				typeof location === 'object' &&
				location !== null &&
				'name' in location &&
				typeof location.name === 'string' &&
				typeof latitude === 'number' &&
				typeof longitude === 'number'
			) {
				parsedLocation = {
					name: location.name,
					coords: [latitude, longitude],
				}
			}
		} catch {
			// Keep the plain-text location fallback.
		}
	}

	const logo = studio.logo?.at(-1)
	const banner = studio.banner?.at(-1)

	return {
		...rest,
		logo: logo ? toMediaFileDto(logo) : { url: '' },
		banner: banner ? [toMediaFileDto(banner)] : [],
		...(studio.owner && {
			owner: toOwnerDto(studio.owner as IUserResponse & { _id: string }),
		}),
		practitioners: studio.practitioners
			? studio.practitioners.map((data) => toPractitionerDto(data.user))
			: [],
		location: parsedLocation,
	}
}
