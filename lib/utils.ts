import slugify from 'slugify'
import hashSum from 'hash-sum'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const generateSlug = (title: string) => {
	const baseSlug = slugify(title, { lower: true, strict: true })
	const hash = hashSum(title).slice(0, 8)
	return `${baseSlug}-${hash}`
}

export const dateString = (start: string | Date, end: string | Date) => {
	const startConverted = format(new Date(start), 'MMM dd')
	const endConverted = format(new Date(end), 'MMM dd')

	if (startConverted === endConverted) return startConverted

	return `${startConverted} - ${endConverted}`
}
