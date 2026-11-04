export default defineEventHandler(async (event) => {
	const session = await getUserSession(event)

	if (!session?.user) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Session expired or not found',
		})
	}

	return {
		user: session.user,
		success: true,
	}
})
