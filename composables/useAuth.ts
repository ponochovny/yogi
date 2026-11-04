import type { TUser } from '~/server/types'
import useFetchApi from './useFetchApi'
import { jwtDecode } from 'jwt-decode'
import type { TStudio } from '~/src/app/types/studio'

/**
 * API response during authentication
 */
interface AuthResponse {
	user: TUser
	access_token: string
}

/**
 * API response during token refresh
 */
interface RefreshResponse {
	access_token: string
}

export default () => {
	// State composables
	const useAuthToken = () => useState('auth_token', () => '')
	const useAuthUser = (): Ref<TUser | null> =>
		useState<TUser | null>('auth_user', () => null)
	const useAuthLoading = () => useState('auth_loading', () => false)
	const useAuthInitLoading = () => useState('auth_init_loading', () => true)
	const useStudioSelected = (): Ref<TStudio | null> =>
		useState<TStudio | null>('auth_studio_selected', () => null)

	// State setters
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

	/**
	 * Registers a new user
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
			const data = await $fetch<AuthResponse>('/api/auth/register', {
				method: 'POST',
				body: {
					name,
					email,
					password,
					repeatPassword,
				},
			})
			setToken(data.access_token)
			setUser(data.user)
		} finally {
			setIsAuthLoading(false)
		}
	}

	/**
	 * Sign in to the system
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
			const data = await $fetch<AuthResponse>('/api/auth/login', {
				method: 'POST',
				body: {
					email,
					password,
				},
			})
			setToken(data.access_token)
			setUser(data.user)
		} finally {
			setIsAuthLoading(false)
		}
	}

	/**
	 * Sign out from the system
	 */
	const logout = async (): Promise<void> => {
		setIsAuthLoading(true)
		try {
			const authToken = useAuthToken()
			await $fetch('/api/auth/logout', {
				method: 'POST',
				headers: authToken.value
					? { Authorization: `Bearer ${authToken.value}` }
					: {},
			})
			setToken('')
			setUser(null)
			await navigateTo('/')
		} finally {
			setIsAuthLoading(false)
		}
	}

	/**
	 * Refresh access token using refresh token
	 */
	const refreshAccessToken = async (): Promise<void> => {
		try {
			const response = await $fetch<RefreshResponse>('/api/auth/refresh', {
				method: 'GET',
			})
			setToken(response.access_token)
		} catch (error) {
			// If refresh token is expired or invalid, sign out
			setToken('')
			setUser(null)
			throw error
		}
	}

	/**
	 * Get current user data
	 */
	const getUser = async (): Promise<void> => {
		const data = await useFetchApi<{ user: TUser }>('/api/auth/user')
		setUser(data.user)
	}

	/**
	 * Update user profile
	 */
	const updateProfile = async (
		newData: Partial<
			Pick<
				TUser,
				'name' | 'email' | 'bio' | 'interestsCategory' | 'interestsType'
			>
		> & { mediaFiles?: { avatar: any } },
	): Promise<TUser> => {
		const authUser = useAuthUser() as Ref<TUser>

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
				},
			)

			const updatedUser = {
				...authUser.value,
				...res.user,
			}

			setUser(updatedUser)
			return updatedUser
		} catch (error: any) {
			throw new Error(error?.data?.message || 'Failed to update profile')
		}
	}

	/**
	 * Calculate time until access token expiry with buffer
	 */
	const getTimeUntilTokenExpiry = (token: string): number => {
		try {
			const decoded = jwtDecode<{ exp: number }>(token)
			if (!decoded.exp) return 0

			// 1 minute buffer before expiry
			const expiryTime = decoded.exp * 1000 - 60000
			const currentTime = Date.now()
			return Math.max(0, expiryTime - currentTime)
		} catch (error) {
			console.error('Failed to decode token:', error)
			return 0
		}
	}

	/**
	 * Automatic access token refresh
	 * Schedules refresh 1 minute before token expiry
	 */
	const scheduleTokenRefresh = (): void => {
		const authToken = useAuthToken()

		if (!authToken.value) {
			return
		}

		const timeUntilExpiry = getTimeUntilTokenExpiry(authToken.value)

		if (timeUntilExpiry <= 0) {
			// Token already expired
			setToken('')
			setUser(null)
			return
		}

		const timeoutId = setTimeout(async () => {
			try {
				await refreshAccessToken()
				// Recursively schedule next refresh
				scheduleTokenRefresh()
			} catch (error) {
				console.error('Failed to refresh token:', error)
				setToken('')
				setUser(null)
			}
		}, timeUntilExpiry)

		// Store timeout ID for cancellation
		if (process.client) {
			window.__tokenRefreshTimeout = timeoutId
		}
	}

	/**
	 * Cancel scheduled token refresh
	 */
	const cancelTokenRefresh = (): void => {
		if (process.client && window.__tokenRefreshTimeout) {
			clearTimeout(window.__tokenRefreshTimeout)
		}
	}

	/**
	 * Initialize authentication on app load
	 */
	const initAuth = async (): Promise<void> => {
		setIsAuthInitLoading(true)
		setIsAuthLoading(true)

		try {
			// Try to refresh access token
			await refreshAccessToken()
			// Get user data
			await getUser()
			// Schedule automatic token refresh
			scheduleTokenRefresh()
		} catch (error) {
			console.error('Auth initialization failed:', error)
			setToken('')
			setUser(null)
		} finally {
			setIsAuthInitLoading(false)
			setIsAuthLoading(false)
		}
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
		refreshAccessToken,
		getUser,
	}
}

/**
 * Global variable for storing token refresh timeout ID
 */
declare global {
	interface Window {
		__tokenRefreshTimeout?: NodeJS.Timeout
	}
}
