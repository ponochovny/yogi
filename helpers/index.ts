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

export function convertPriceStringToNumber(priceStr: string): number {
	const numericPart = priceStr.replace(/[^\d.]/g, '')
	let cents = ''
	const [dollars, _cents] = numericPart.split('.')
	if (!_cents) {
		cents = '00'
	} else if (_cents.length === 1) {
		cents += '0'
	} else {
		cents = _cents.substring(0, 2)
	}
	return parseInt(dollars + cents, 10)
}
