import { prisma } from '.'
import type { Prisma } from '@prisma/client'
import type { DefaultArgs } from '@prisma/client/runtime/library'

// TODO: offering types
export const createOffering = (offeringData: any) => {
	return prisma.offering.create({
		data: {
			...offeringData,
		},
	})
}
// TODO: offering types
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

export const updateOfferingsByStudioId = (
	offeringData: any,
	studioId: string
) => {
	return prisma.offering.updateMany({
		where: {
			studio: {
				id: studioId,
			},
		},
		data: {
			...offeringData,
		},
	})
}

export const getOfferings = <T>(
	params: Prisma.OfferingFindManyArgs<DefaultArgs> = {}
): Promise<T> => {
	return prisma.offering.findMany({ ...params }) as Promise<T>
}

export const getOfferingBySlug = <T>(
	slug: string,
	params: Prisma.OfferingFindUniqueArgs<DefaultArgs>
): Promise<T> | null => {
	return prisma.offering.findUnique({
		...params,
		where: {
			...params?.where,
			slug,
		},
	}) as unknown as Promise<T> | null
}
export const getOfferingById = <T>(
	id: string,
	params: Prisma.OfferingFindUniqueArgs<DefaultArgs>
): Promise<T> | null => {
	return prisma.offering.findUnique({
		...params,
		where: {
			...params?.where,
			id,
		},
	}) as unknown as Promise<T> | null
}
export const getOfferingsByStudioId = <T>(
	params: Prisma.OfferingFindUniqueArgs<DefaultArgs>
): Promise<T> => {
	return prisma.offering.findMany({
		...params,
		where: {
			...params?.where,
		},
	}) as Promise<T>
}
