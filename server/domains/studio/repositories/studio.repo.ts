import type { Prisma } from '@prisma/client'
import type { DefaultArgs } from '@prisma/client/runtime/library'
import { prisma } from '~/server/domains/shared'
import type { TCreateStudioData, TUpdateStudioData } from '~/server/types/studio'

export const StudioRepo = {
	create: (studioData: TCreateStudioData) => {
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
	},

	update: (studioData: TUpdateStudioData, studioId: string) => {
		return prisma.studio.update({
			where: { id: studioId },
			data: {
				bio: studioData.bio,
				currency: studioData.currency,
				mission: studioData.mission,
				name: studioData.name,
				timezone: studioData.timezone,
				categories: studioData.categories,
				types: studioData.types,
				location: studioData.location,
			},
		})
	},

	findMany: (params: Prisma.StudioFindManyArgs<DefaultArgs> = {}) => {
		return prisma.studio.findMany({ ...params })
	},

	findBySlug: (slug: string, params: Prisma.StudioFindUniqueArgs<DefaultArgs>) => {
		return prisma.studio.findUnique({
			...params,
			where: { ...params?.where, slug },
		})
	},

	toggleArchive: (id: string, isArchived: boolean, params?: Prisma.StudioUpdateArgs<DefaultArgs>) => {
		return prisma.studio.update({
			...params,
			where: { ...params?.where, id },
			data: { isArchived },
		})
	},
}
