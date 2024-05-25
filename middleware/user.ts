export default defineNuxtRouteMiddleware(() => {
	const { useAuthInitLoading, useAuthUser } = useAuth()
	const authInitLoading = useAuthInitLoading()
	const user = useAuthUser()

	watch(
		() => authInitLoading.value,
		(val) => {
			if (!val) {
				if (!user.value) return navigateTo('/auth')
			}
		},
		{
			immediate: true,
		}
	)
})
