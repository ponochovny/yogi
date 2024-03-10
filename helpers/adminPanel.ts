import {
	PencilSquareIcon,
	SparklesIcon,
	UserGroupIcon,
	ChevronLeftIcon,
	BookOpenIcon,
} from '@heroicons/vue/24/outline'

export const userMenu = [
	{
		name: 'Edit profile',
		icon: PencilSquareIcon,
		link: '/user/profile',
	},
	{
		name: 'Interests',
		icon: SparklesIcon,
		link: '/user/interests',
	},
	{
		name: 'Studio',
		icon: UserGroupIcon,
		link: '/user/studio',
	},
]
export const userOfferingSettingsMenu = [
	{
		name: 'Back',
		icon: ChevronLeftIcon,
		link: '/user/profile',
	},
	{
		name: 'Offerings',
		icon: BookOpenIcon,
		link: '/user/studio/offerings',
	},
]

export const categories = [
	'Flow Arts',
	'Yoga',
	'Meditation',
	'Breath work',
	'Aerial',
	'Energy Reading & Healing',
	'Dance',
	'Massage',
	'Pilates',
	'Physiotherapy',
	'Coaching',
	'Acupuncture',
	'Psychotherapy',
	'Sound Healing',
	'Transformational Tool',
]

export const types = [
	'Festival',
	'Retreat',
	'Workshop',
	'Teacher Training',
	'Course',
	'Group Class',
	'Private Session',
	'Treatment',
	'Private Party',
]
