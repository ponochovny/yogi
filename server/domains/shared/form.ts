import type { H3Event, EventHandlerRequest } from 'h3'
import formidable from 'formidable'

const convertFields = (fields: { [key: string]: any[] | string | undefined }) => {
	const result: Record<string, unknown> = {}

	for (const key in fields) {
		if (Array.isArray(fields[key]) && fields[key]?.length === 1) {
			result[key] = fields[key]![0]
		} else {
			result[key] = fields[key]
		}
	}

	return result
}

export const extractForm = <T>(event: H3Event<EventHandlerRequest>): Promise<T> => {
	const form = formidable({ multiples: true })
	return new Promise<T>((resolve, reject) => {
		form.parse(event.node.req, (error, fields, files) => {
			if (error) {
				reject(error)
				return
			}
			resolve({ fields: convertFields(fields), files } as T)
		})
	})
}

export const extractFormFiles = <T>(event: H3Event<EventHandlerRequest>): Promise<T> => {
	const form = formidable()
	return new Promise<T>((resolve, reject) => {
		form.parse(event.node.req, (error, fields, files) => {
			if (error) {
				reject(error)
				return
			}
			Object.entries(fields).forEach(([key, value]: any) => ((fields as any)[key] = value[0]))
			Object.entries(files).forEach(([key, value]: any) => ((files as any)[key] = value[0]))
			resolve({ fields, files } as T)
		})
	})
}
