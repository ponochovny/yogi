import { createError } from 'h3'

export const domainError = (statusCode: number, statusMessage: string) =>
	createError({ statusCode, statusMessage })

export const badRequest = (statusMessage: string) =>
	domainError(400, statusMessage)

export const unauthorized = (statusMessage = 'Unauthorized') =>
	domainError(401, statusMessage)

export const forbidden = (statusMessage = 'Forbidden') =>
	domainError(403, statusMessage)

export const notFound = (statusMessage: string) =>
	domainError(404, statusMessage)

export const internalError = (statusMessage = 'Internal server error') =>
	domainError(500, statusMessage)
