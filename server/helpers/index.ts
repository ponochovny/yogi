import type { H3Event, EventHandlerRequest } from 'h3'
import formidable from 'formidable'

export const extractForm = <T>(event: H3Event<EventHandlerRequest>): T => {
	const form = formidable({})
	return new Promise((resolve, reject) => {
		form.parse(event.node.req, (error, fields, files) => {
			if (error) {
				reject(error)
			}
			resolve({ fields, files })
		})
	}) as T
}
