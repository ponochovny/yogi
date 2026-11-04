import type { TUser } from '~/server/types'
import type { TStudio } from '~/src/app/types/studio'
import useFetchApi from './useFetchApi'

export default () => {
	const { user: sessionUser, loggedIn, clear, fetch: refreshSession } = useUserSession()

	const useAuthUser = (): Ref<TUser | null> => sessionUser as Ref<TUser | null>
	const useAuthLoading = () => useState('auth_loading', () => false)
	const useAuthInitLoading = () => useState('auth_init_loading', () => false)
	const useAuthToken = () => useState('auth_token', () => '')
	const useStudioSelected = (): Ref<TStudio | null> =>
		useState<TStudio | null>('auth_studio_selected', () => null)

	const setIsAuthLoading = (value: boolean) => {
		useAuthLoading().value = value
	}

	/**
	 * Registers a new user and sets up encrypted session
	 */
	const register = async ({
		name,
		email,
		password,
		repeatPassword,
	}: {
		name: string
		email: string
		password: string
		repeatPassword: string
	}): Promise<void> => {
		setIsAuthLoading(true)
		try {
			await $fetch('/api/auth/register', {
				method: 'POST',
				body: { name, email, password, repeatPassword },
			})
			await refreshSession()
		} finally {
			setIsAuthLoading(false)
		}
	}

	/**
	 * Signs in user and sets up encrypted session
	 */
	const login = async ({
		email,
		password,
	}: {
		email: string
		password: string
	}): Promise<void> => {
		setIsAuthLoading(true)
		try {
			await $fetch('/api/auth/login', {
				method: 'POST',
				body: { email, password },
			})
			await refreshSession()
		} finally {
			setIsAuthLoading(false)
		}
	}

	/**
	 * Signs out and clears session
	 */
	const logout = async (): Promise<void> => {
		setIsAuthLoading(true)
		try {
			await clear()
			await navigateTo('/')
		} finally {
			setIsAuthLoading(false)
		}
	}

	/**
	 * Refetches current session
	 */
	const getUser = async (): Promise<void> => {
		await refreshSession()
	}

	/**
	 * Updates user profile
	 */
	const updateProfile = async (
		newData: Partial<
			Pick<
				TUser,
				'name' | 'email' | 'bio' | 'interestsCategory' | 'interestsType'
			>
		> & { mediaFiles?: { avatar: any } }
	): Promise<TUser> => {
		const authUser = useAuthUser()
		if (!authUser.value) {
			throw new Error('User not authenticated')
		}

		const form = new FormData()
		const { mediaFiles, ...rest } = newData

		form.append('userId', authUser.value.id)

		Object.entries(rest).forEach(([key, value]) => {
			if (value !== undefined) {
				form.append(key, value as string)
			}
		})

		if (mediaFiles?.avatar) {
			form.append('avatar', mediaFiles.avatar)
		}

		try {
			const res = await useFetchApi<{ user: TUser }>(
				'/api/auth/updateProfile',
				{
					method: 'POST',
					body: form,
				}
			)

			await refreshSession()
			return res.user
		} catch (error: any) {
			throw new Error(error?.data?.message || 'Failed to update profile')
		}
	}

	/**
	 * Initializes session on load
	 */
	const initAuth = async (): Promise<void> => {
		await refreshSession()
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
		getUser,
		loggedIn,
	}
}
