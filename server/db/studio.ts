import type { IStudio } from '~/helpers/types/studio'
import { prisma } from '.'
import type { Prisma } from '@prisma/client'
import type { DefaultArgs } from '@prisma/client/runtime/library'

export const createStudio = (
	studioData: Pick<
		IStudio,
		| 'banner'
		| 'bio'
		| 'currency'
		| 'logo'
		| 'mission'
		| 'name'
		| 'timezone'
		| 'ownerId'
		| 'categories'
		| 'types'
		| 'location'
	>
) => {
	return prisma.studio.create({
		data: {
			// banner: [studioData.banner],
			bio: studioData.bio,
			currency: studioData.currency,
			// logo: studioData.logo,
			mission: studioData.mission,
			name: studioData.name,
			timezone: studioData.timezone,
			categories: studioData.categories,
			types: studioData.types,
			location: studioData.location,
			ownerId: studioData.ownerId,
		},
	})
}

export const getStudios = (
	params: Prisma.StudioFindManyArgs<DefaultArgs> = {}
) => {
	return prisma.studio.findMany({
		...params,
	})
}
