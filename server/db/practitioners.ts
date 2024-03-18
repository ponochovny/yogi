import { prisma } from '.'

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
