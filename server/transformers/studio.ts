/* eslint-disable indent */
import type { IUser } from '../types'
import { mediaFileTransformer } from './mediaFiles'
import { ownerTransformer, practitionerTransformer } from './user'

// TODO: set studio type
export const studioTransformer = (studio: any) => {
	if (!studio) return null

	const { createdAt, updatedAt, ownerId, ...rest } = studio

	const parsedLocation = JSON.parse(JSON.stringify(studio.location))

	return {
		...rest,
		logo:
			studio.logo && studio.logo.length
				? Array.of(studio.logo.pop()).map(mediaFileTransformer)[0]
				: [],
		banner:
			studio.banner && studio.banner.length
				? Array.of(studio.banner.pop()).map(mediaFileTransformer)
				: [],
		owner: ownerTransformer(studio.owner),
		practitioners: studio.practitioners
			? studio.practitioners.map(
					(data: { user: IUser }) => practitionerTransformer(data.user)
					// eslint-disable-next-line no-mixed-spaces-and-tabs
			  )
			: [],
		location:
			typeof parsedLocation === 'string'
				? JSON.parse(parsedLocation)
				: parsedLocation,
	}
}
