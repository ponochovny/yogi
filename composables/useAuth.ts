import type { TUser } from '~/server/types'
import useFetchApi from './useFetchApi'
import { jwtDecode } from 'jwt-decode'
import type { TStudio } from '~/helpers/types/studio'

export default () => {
	const useAuthToken = () => useState('auth_token')
	const useAuthUser = (): Ref<TUser | null> =>
		useState<TUser | null>('auth_user')
	const useAuthLoading = () => useState('auth_loading', () => true)
	const useAuthInitLoading = () => useState('auth_init_loading', () => true)
	const useStudioSelected = (): Ref<TStudio | null> =>
		useState<TStudio | null>('auth_studio_selected', () => null)

	const setToken = (newToken: string) => {
		const authToken = useAuthToken()
		authToken.value = newToken
	}

	const setUser = (newUser: TUser | null) => {
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

	const register = ({
		name,
		email,
		password,
		repeatPassword,
	}: {
		name: string
		email: string
		password: string
		repeatPassword: string
	}) => {
		return new Promise(async (resolve, reject) => {
			try {
				setIsAuthLoading(true)
				const data: { user: TUser; access_token: string } = await $fetch(
					'/api/auth/register',
					{
						method: 'POST',
						body: {
							name,
							email,
							password,
							repeatPassword,
						},
					}
				)
				setToken(data.access_token)
				setUser(data.user)

				resolve(true)
			} catch (error) {
				reject(error)
			} finally {
				setIsAuthLoading(false)
			}
		})
	}

	const login = ({ email, password }: { email: string; password: string }) => {
		return new Promise(async (resolve, reject) => {
			try {
				setIsAuthLoading(true)
				// @ts-ignore
				const data: { user: TUser; access_token: string } = await $fetch(
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

				await $fetch('/api/auth/logout', {
					method: 'POST',
					body: {
						refreshToken: authToken.value,
					},
				})
				setToken('')
				setUser(null)
				navigateTo('/')

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
				const { access_token } = await $fetch('/api/auth/refresh')

				setToken(access_token)
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

	const updateProfile = async (
		newData: Partial<
			Pick<
				TUser,
				'name' | 'email' | 'bio' | 'interestsCategory' | 'interestsType'
			>
		> & { mediaFiles?: { avatar: any } }
	) => {
		// TODO: set type
		const authUser = useAuthUser() as Ref<TUser>

		const form = new FormData()

		const { mediaFiles, ...rest } = newData

		form.append('userId', authUser.value.id)

		Object.keys(rest).map((key: string) => {
			// @ts-ignore
			form.append(key, rest[key])
		})
		if (mediaFiles?.avatar) {
			form.append('avatar', mediaFiles.avatar)
		}

		try {
			const res = await useFetchApi<any>('/api/auth/updateProfile', {
				method: 'POST',
				body: form,
			})

			setUser(res.user)
			return res.user
		} catch (error) {
			throw new Error((error as Error).message)
		}
	}

	const reRefreshAccessToken = () => {
		const authToken = useAuthToken()

		if (!authToken.value) {
			return
		}

		const jwt = jwtDecode(authToken.value as string)

		if (!jwt.exp) return

		const newRefreshTime = jwt.exp - 60000

		setTimeout(() => {
			// try {
			refreshToken()
			// await refreshToken()
			// } catch (error) {
			// 	console.log(error)
			// }
			reRefreshAccessToken()
		}, newRefreshTime)
	}

	const initAuth = () => {
		return new Promise(async (resolve, reject) => {
			try {
				setIsAuthInitLoading(true)
				setIsAuthLoading(true)

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
		register,
		logout,
		useAuthUser,
		useAuthToken,
		initAuth,
		useAuthLoading,
		useAuthInitLoading,
		updateProfile,
		useStudioSelected,
	}
}
