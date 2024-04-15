import currencies from '~/helpers/currencies.json'
import flags from '~/helpers/flagsList.json'

export function activityColorClass(activity: string) {
	if (activity.toLowerCase() === 'class') {
		return 'text-blue-500/90'
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

export const currencySymbolByCode = (code: string): string => {
	return (
		currencies.find((el) => el.code.toLowerCase() === code.toLowerCase())
			?.symbol || ''
	)
}

export const findFlagByCountryName = (name: string) => {
	const countryFlagData = flags.find((el) => el.country.includes(name))
	return countryFlagData?.img || ''
}

export const coordinatesToDMS = (lat: number, long: number) => {
	// 41.894036, 12.477636 -> 41°53'38.5"N 12°28'39.5"E
	function toDMS(coordinate: number) {
		const degrees = Math.floor(coordinate)
		const minutesDecimal = (coordinate - degrees) * 60
		const minutes = Math.floor(minutesDecimal)
		const seconds = ((minutesDecimal - minutes) * 60).toFixed(1)
		return `${degrees}°${minutes}'${seconds}"`
	}

	const latCardinal = lat >= 0 ? 'N' : 'S'
	const longCardinal = long >= 0 ? 'E' : 'W'

	return `${toDMS(Math.abs(lat))}${latCardinal} ${toDMS(
		Math.abs(long)
	)}${longCardinal}`
}
export const identifyInputMapType = (input: string) => {
	const coordinatesPattern = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/

	if (coordinatesPattern.test(input)) {
		return 'coords'
	} else {
		return 'text'
	}
}
