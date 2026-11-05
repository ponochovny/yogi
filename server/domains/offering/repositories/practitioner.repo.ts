import type { Prisma } from '@prisma/client'
import type { DefaultArgs } from '@prisma/client/runtime/library'
import { prisma } from '~/server/domains/shared'

export const PractitionerRepo = {
	attachToOffering: (data: { userId: string; offeringId: string }) => {
		return prisma.practitioner.create({ data })
	},

	attachToStudio: (data: { userId: string; studioId: string }) => {
		return prisma.practitioner.create({ data })
	},

	findMany: <T>(params?: Prisma.PractitionerFindManyArgs<DefaultArgs>): Promise<T> => {
		return prisma.practitioner.findMany({ ...params }) as Promise<T>
	},

	findManyByStudioId: (studioId: string, params?: Prisma.PractitionerFindManyArgs<DefaultArgs>) => {
		return prisma.practitioner.findMany({
			...params,
			where: { ...params?.where, studioId },
		})
	},

	findById: (params: Prisma.PractitionerFindUniqueArgs<DefaultArgs>) => {
		return prisma.practitioner.findUnique(params)
	},

	findFirstByUserId: (params: Prisma.PractitionerFindFirstArgs<DefaultArgs>) => {
		return prisma.practitioner.findFirst(params)
	},

	findManyByUserId: (params: Prisma.PractitionerFindManyArgs<DefaultArgs>) => {
		return prisma.practitioner.findMany(params)
	},

	findByStudioId: (pracId: string, studioId: string) => {
		return prisma.practitioner.findFirst({
			where: { userId: pracId, studioId },
		})
	},

	removeMany: (params: Prisma.PractitionerDeleteManyArgs<DefaultArgs>) => {
		return prisma.practitioner.deleteMany(params)
	},
}
