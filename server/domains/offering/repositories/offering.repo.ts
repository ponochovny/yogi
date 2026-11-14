import type { Prisma } from '@prisma/client'
import type { DefaultArgs } from '@prisma/client/runtime/library'
import { prisma } from '~/server/domains/shared'

export const OfferingRepo = {
	create: (offeringData: any) => {
		return prisma.offering.create({ data: { ...offeringData } })
	},

	update: (offeringData: any, offeringId: string) => {
		return prisma.offering.update({
			where: { id: offeringId },
			data: { ...offeringData },
		})
	},

	updateManyByStudioId: (offeringData: any, studioId: string) => {
		return prisma.offering.updateMany({
			where: { studio: { id: studioId } },
			data: { ...offeringData },
		})
	},

	findMany: <T>(params: Prisma.OfferingFindManyArgs<DefaultArgs> = {}): Promise<T> => {
		return prisma.offering.findMany({ ...params }) as Promise<T>
	},

	findBySlug: <T>(slug: string, params: Prisma.OfferingFindUniqueArgs<DefaultArgs>): Promise<T> | null => {
		return prisma.offering.findUnique({
			...params,
			where: { ...params?.where, slug },
		}) as unknown as Promise<T> | null
	},

	findById: <T>(id: string, params: Prisma.OfferingFindUniqueArgs<DefaultArgs>): Promise<T> | null => {
		return prisma.offering.findUnique({
			...params,
			where: { ...params?.where, id },
		}) as unknown as Promise<T> | null
	},

	findManyByStudioId: <T>(params: Prisma.OfferingFindUniqueArgs<DefaultArgs>): Promise<T> => {
		return prisma.offering.findMany({
			...params,
			where: { ...params?.where },
		}) as Promise<T>
	},

	countLive: () => {
		const currentDateISO = new Date().toISOString()
		return prisma.offering.count({
			where: {
				start: { lte: currentDateISO },
				end: { gte: currentDateISO },
				isActive: true,
			},
		})
	},
}
