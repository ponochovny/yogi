import { prisma } from '.'

export const insertCategories = () => {
	return prisma.category.createMany({
		data: [
			{ name: 'Flow Arts' },
			{ name: 'Yoga' },
			{ name: 'Meditation' },
			{ name: 'Breath work' },
			{ name: 'Aerial' },
			{ name: 'Energy Reading & Healing' },
			{ name: 'Dance' },
			{ name: 'Massage' },
			{ name: 'Pilates' },
			{ name: 'Physiotherapy' },
			{ name: 'Coaching' },
			{ name: 'Acupuncture' },
			{ name: 'Psychotherapy' },
			{ name: 'Sound Healing' },
			{ name: 'Transformational Tool' },
		],
	})
}
export const insertTypes = () => {
	return prisma.type.createMany({
		data: [
			{ name: 'Festival' },
			{ name: 'Retreat' },
			{ name: 'Workshop' },
			{ name: 'Teacher Training' },
			{ name: 'Course' },
			{ name: 'Group Class' },
			{ name: 'Private Session' },
			{ name: 'Treatment' },
			{ name: 'Private Party' },
		],
	})
}

export const getOfferingCategories = () => {
	return prisma.category.findMany()
}
export const getOfferingTypes = () => {
	return prisma.type.findMany()
}
