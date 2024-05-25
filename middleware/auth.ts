export default defineNuxtRouteMiddleware(() => {
	const { useAuthInitLoading, useAuthUser } = useAuth()
	const authInitLoading = useAuthInitLoading()
	const user = useAuthUser()

	watch(
		() => authInitLoading.value,
		(val) => {
			if (!val) {
				if (user.value) {
					return useRouter().push('/')
				}
			}
		},
		{
			immediate: true,
		}
	)
})
