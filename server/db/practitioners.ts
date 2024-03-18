import { prisma } from '.'

export const attachPractitionerToOffering = (data: {
	userId: string
	offeringId: string
}) => {
	return prisma.practitionerStudio.create({
		data: {
			...data,
		},
	})
}
export const attachPractitionerToStudio = (data: {
	userId: string
	studioId: string
}) => {
	return prisma.practitionerStudio.create({
		data: {
			...data,
		},
	})
}
