import { prisma } from '.'
import type { Prisma } from '@prisma/client'
import type { DefaultArgs } from '@prisma/client/runtime/library'
import type { TUpdateStudioData, TCreateStudioData } from '../types/studio'

export const createStudio = (studioData: TCreateStudioData) => {
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
	studioData: TUpdateStudioData,
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
			// ownerId: studioData.ownerId,
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

export const toggleArchiveStudioById = (
	id: string,
	isArchived: boolean,
	params?: Prisma.StudioUpdateArgs<DefaultArgs>
) => {
	return prisma.studio.update({
		...params,
		where: {
			...params?.where,
			id,
		},
		data: {
			isArchived,
		},
	})
}
