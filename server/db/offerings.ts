import { prisma } from '.'
import type { Prisma } from '@prisma/client'
import type { DefaultArgs } from '@prisma/client/runtime/library'

export const createOffering = (offeringData: any) => {
	return prisma.offering.create({
		data: {
			...offeringData,
		},
	})
}
export const updateOffering = (offeringData: any, offeringId: string) => {
	return prisma.offering.update({
		where: {
			id: offeringId,
		},
		data: {
			...offeringData,
		},
	})
}

export const getOfferings = (
	params: Prisma.OfferingFindManyArgs<DefaultArgs> = {}
) => {
	return prisma.offering.findMany({ ...params })
}

export const getOfferingBySlug = (
	slug: string,
	params: Prisma.OfferingFindUniqueArgs<DefaultArgs>
) => {
	return prisma.offering.findUnique({
		...params,
		where: {
			...params?.where,
			slug,
		},
	})
}
export const getOfferingsByStudioId = (
	params: Prisma.OfferingFindUniqueArgs<DefaultArgs>
) => {
	return prisma.offering.findMany({
		...params,
		where: {
			...params?.where,
		},
	})
}
