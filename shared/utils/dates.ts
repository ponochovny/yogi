import format from 'date-fns/format'

/**
 *
 * @param start
 * @param end
 * @returns dStart or ${dStart} - ${dEnd}
 */
export const formattedDate = (start?: Date, end?: Date) => {
	const dStart = start ? format(start, 'MMM dd') : ''
	const dEnd = end ? format(end, 'MMM dd') : ''

	if (dStart === dEnd) {
		return dStart
	} else {
		return `${dStart} - ${dEnd}`
	}
}
