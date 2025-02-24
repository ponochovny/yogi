/* eslint-disable no-mixed-spaces-and-tabs */
import type { IUserResponse } from '../types'
import type { IStudioResponse } from '../types/studio'
import { mediaFileTransformer } from './mediaFiles'
import { ownerTransformer, practitionerTransformer } from './user'
import type { TStudio } from '~/src/app/types/studio'

// TODO: set studio type
export const studioTransformer = (studio: IStudioResponse): TStudio => {
	const { createdAt, updatedAt, ownerId, ...rest } = studio

	const parsedLocation = JSON.parse(JSON.stringify(studio.location))

	return {
		...rest,
		logo:
			studio.logo && studio.logo.length
				? Array.of(studio.logo.pop()).map(mediaFileTransformer)[0]
				: { url: '' },
		banner:
			studio.banner && studio.banner.length
				? Array.of(studio.banner.pop()).map(mediaFileTransformer)
				: [],
		...(studio.owner && {
			owner: ownerTransformer(studio.owner as IUserResponse & { _id: string }),
		}),
		practitioners: studio.practitioners
			? studio.practitioners.map((data) => practitionerTransformer(data.user))
			: [],
		location:
			typeof parsedLocation === 'string'
				? JSON.parse(parsedLocation)
				: parsedLocation,
	}
}
