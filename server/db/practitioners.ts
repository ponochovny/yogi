import { prisma } from '.'
import type { Prisma } from '@prisma/client'
import type { DefaultArgs } from '@prisma/client/runtime/library'

export const attachPractitionerToOffering = (data: {
	userId: string
	offeringId: string
}) => {
	return prisma.practitioner.create({
		data: {
			...data,
		},
	})
}
export const attachPractitionerToStudio = (data: {
	userId: string
	studioId: string
}) => {
	return prisma.practitioner.create({
		data: {
			...data,
		},
	})
}
export const getPractitionersByStudioID = (
	studioId: string,
	params?: Prisma.PractitionerFindManyArgs<DefaultArgs>
) => {
	return prisma.practitioner.findMany({
		...params,
		where: {
			...params?.where,
			studioId,
		},
	})
}

export const getPractitionerById = (
	params: Prisma.PractitionerFindUniqueArgs<DefaultArgs>
) => {
	return prisma.practitioner.findUnique(params)
}
export const getPractitionerByUserId = (
	params: Prisma.PractitionerFindFirstArgs<DefaultArgs>
) => {
	return prisma.practitioner.findFirst(params)
}
export const getPractitionersByUserId = (
	params: Prisma.PractitionerFindManyArgs<DefaultArgs>
) => {
	return prisma.practitioner.findMany(params)
}

export const getPractitionerByStudioID = (pracId: string, studioId: string) => {
	return prisma.practitioner.findFirst({
		where: {
			userId: pracId,
			studioId,
		},
	})
}
export const removePractitioner = (
	params: Prisma.PractitionerDeleteManyArgs<DefaultArgs>
) => {
	return prisma.practitioner.deleteMany(params)
}
