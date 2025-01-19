import { format } from 'date-fns'

export function objectToQueryParams(obj: Record<string, any>): string {
	if (!obj || typeof obj !== 'object') {
		throw new Error('Input must be an object.')
	}

	const buildParam = (key: string, value: any): string => {
		if (Array.isArray(value)) {
			return value
				.map(
					(v, i) =>
						`${encodeURIComponent(`${key}[${i}]`)}=${encodeURIComponent(
							String(v)
						)}`
				)
				.join('&')
		} else {
			return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
		}
	}

	return Object.entries(obj)
		.filter(([_, value]) => value !== null && value !== undefined)
		.map(([key, value]) => buildParam(key, value))
		.join('&')
}

export function searchLiveOfferingsLink() {
	const today: string = format(new Date(), 'yyyy-MM-dd')
	const params: string = objectToQueryParams({ start: today, end: today })

	return `/search?${params}`
}
