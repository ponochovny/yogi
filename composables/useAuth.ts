import type { IUser } from '~/server/types'
import useFetchApi from './useFetchApi'
import { jwtDecode } from 'jwt-decode'

export default () => {
	const useAuthToken = () => useState('auth_token')
	const useAuthUser = (): Ref<IUser | unknown> =>
		useState<IUser | unknown>('auth_user')
	const useAuthLoading = () => useState('auth_loading', () => true)
	const useAuthInitLoading = () => useState('auth_init_loading', () => true)

	const setToken = (newToken: string) => {
		const authToken = useAuthToken()
		authToken.value = newToken
	}

	// TODO: set type
	const setUser = (newUser: IUser | null) => {
		const authUser = useAuthUser()
		authUser.value = newUser
	}

	const setIsAuthLoading = (value: boolean) => {
		const authLoading = useAuthLoading()
		authLoading.value = value
	}
	const setIsAuthInitLoading = (value: boolean) => {
		const authInitLoading = useAuthInitLoading()
		authInitLoading.value = value
	}

	const login = ({ email, password }: { email: string; password: string }) => {
		return new Promise(async (resolve, reject) => {
			try {
				setIsAuthLoading(true)
				// TODO: set type
				// @ts-ignore
				const data: { user: IUser; access_token: string } = await $fetch(
					'/api/auth/login',
					{
						method: 'POST',
						body: {
							email,
							password,
						},
					}
				)
				setToken(data.access_token)
				setUser(data.user)

				console.log(data)
				resolve(true)
			} catch (error) {
				reject(error)
			} finally {
				setIsAuthLoading(false)
			}
		})
	}

	const logout = () => {
		return new Promise(async (resolve, reject) => {
			try {
				setIsAuthLoading(true)

				const authToken = useAuthToken()

				console.log('auth token: ', authToken.value)

				await $fetch('/api/auth/logout', {
					method: 'POST',
					body: {
						refreshToken: authToken.value,
					},
				})
				setToken('')
				setUser(null)

				resolve(true)
			} catch (error) {
				reject(error)
			} finally {
				setIsAuthLoading(false)
			}
		})
	}

	const refreshToken = () => {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await $fetch('/api/auth/refresh')

				setToken(data.access_token)
				resolve(true)
			} catch (error) {
				reject(error)
			}
		})
	}

	const getUser = () => {
		return new Promise(async (resolve, reject) => {
			try {
				// TODO: set type
				const data = await useFetchApi<any>('/api/auth/user')

				setUser(data.user)
				resolve(true)
			} catch (error) {
				reject(error)
			}
		})
	}

	const updateProfile = (newData: Pick<IUser, 'name' | 'email'>) => {
		return new Promise(async (resolve, reject) => {
			// TODO: set type
			const authUser = useAuthUser() as Ref<IUser>

			try {
				// TODO: set type
				const data = await useFetchApi<any>('/api/auth/updateProfile', {
					method: 'POST',
					body: {
						...newData,
						userId: authUser.value?.id || '',
					},
				})

				setUser(data.user)
				resolve(true)
			} catch (error) {
				reject(error)
			}
		})
	}

	const reRefreshAccessToken = () => {
		const authToken = useAuthToken()

		if (!authToken.value) {
			return
		}

		const jwt = jwtDecode(authToken.value as string)

		if (!jwt.exp) return

		const newRefreshTime = jwt.exp - 60000

		setTimeout(async () => {
			await refreshToken()
			reRefreshAccessToken()
		}, newRefreshTime)
	}

	const initAuth = () => {
		return new Promise(async (resolve, reject) => {
			setIsAuthInitLoading(true)
			setIsAuthLoading(true)
			try {
				await refreshToken()
				await getUser()

				reRefreshAccessToken()

				resolve(true)
			} catch (error) {
				reject(error)
			} finally {
				setIsAuthInitLoading(false)
				setIsAuthLoading(false)
			}
		})
	}

	return {
		login,
		logout,
		useAuthUser,
		useAuthToken,
		initAuth,
		useAuthLoading,
		useAuthInitLoading,
		updateProfile,
	}
}
