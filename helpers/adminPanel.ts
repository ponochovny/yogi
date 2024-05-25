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
export const userOfferingSettingsMenu = (creation?: boolean) =>
	computed(() => {
		const { useStudioSelected } = useAuth()
		const route = useRoute()
		const studioSelected = useStudioSelected()
		const id = studioSelected.value?.id || route.params?.id || ''

		const defaultMenu = [
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

		const isDefaultMenu = defaultMenu.find((el) => el.link === route.path)

		if (isDefaultMenu) return defaultMenu

		if (creation) {
			return [
				{
					name: 'Back',
					icon: ChevronLeftIcon,
					link: `/user/studio/${id}/offerings`,
				},
			]
		}

		return [
			{
				name: 'Back',
				icon: ChevronLeftIcon,
				link: '/user/studio',
			},
			{
				name: 'Offerings',
				icon: BookOpenIcon,
				link: `/user/studio/${id}/offerings`,
			},
		]
	})

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
