import type { IStudio } from '~/helpers/types/studio'
import { prisma } from '.'
import type { Prisma } from '@prisma/client'
import type { DefaultArgs } from '@prisma/client/runtime/library'

export const createStudio = (
	studioData: Pick<
		IStudio,
		| 'bio'
		| 'currency'
		| 'mission'
		| 'name'
		| 'slug'
		| 'timezone'
		| 'ownerId'
		| 'categories'
		| 'types'
	> & { location: string }
) => {
	return prisma.studio.create({
		data: {
			bio: studioData.bio,
			slug: studioData.slug,
			currency: studioData.currency,
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
export const updateStudio = (
	studioData: Pick<
		IStudio,
		| 'bio'
		| 'currency'
		| 'mission'
		| 'name'
		| 'timezone'
		| 'ownerId'
		| 'categories'
		| 'types'
	> & { location: string },
	studioId: string
) => {
	return prisma.studio.update({
		where: {
			id: studioId,
		},
		data: {
			bio: studioData.bio,
			currency: studioData.currency,
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

export const getStudioBySlug = (
	slug: string,
	params: Prisma.StudioFindUniqueArgs<DefaultArgs>
) => {
	return prisma.studio.findUnique({
		...params,
		where: {
			...params?.where,
			slug,
		},
	})
}
