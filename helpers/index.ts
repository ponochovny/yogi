export function activityColorClass(activity: string) {
	if (activity.toLowerCase() === 'class') {
		return 'text-blue-700'
	}
	if (activity.toLowerCase() === 'event') {
		return 'text-red-400'
	}
	if (activity.toLowerCase() === 'appointment') {
		return 'text-yellow-500'
	}
}
