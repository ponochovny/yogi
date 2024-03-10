import { prisma } from '.'

export const createOffering = (offeringData: any) => {
	return prisma.offering.create({
		data: {
			...offeringData,
		},
	})
}
