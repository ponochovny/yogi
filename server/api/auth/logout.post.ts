export default defineEventHandler(async (event) => {
	try {
		await clearUserSession(event)

		return {
			statusCode: 200,
			success: true,
		}
	} catch (error: any) {
		console.error('Logout error:', error)
		throw createError({
			statusCode: 500,
			statusMessage: 'An error occurred during logout',
		})
	}
})
