export default defineNuxtRouteMiddleware(() => {
	const { useAuthUser } = useAuth()
	const user = useAuthUser()

	if (!user.value) return navigateTo('/')
})
