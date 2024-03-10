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

export const getOfferings = (
	params: Prisma.OfferingFindManyArgs<DefaultArgs> = {}
) => {
	return prisma.offering.findMany({ ...params })
}
