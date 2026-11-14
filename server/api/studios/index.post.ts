import formidable from 'formidable'
import { StudioService } from '~/server/domains/studio'

export default defineEventHandler(async (event) => {
	const form = formidable({})

	const formExtracted = await new Promise<{
		fields: Record<string, string[] | undefined>
		files: any
	}>((resolve, reject) => {
		form.parse(event.node.req, (error, fields, files) => {
			if (error) {
				reject(error)
				return
			}
			resolve({ fields, files })
		})
	})

	const { fields, files } = formExtracted
	const userId = event.context.auth.user.id

	return StudioService.createStudio(fields, files, userId)
})
