import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { IUser } from '../types'

const generateAccessToken = (user: IUser) => {
	const config = useRuntimeConfig()

	return jwt.sign({ userId: user.id }, config.jwtAccessSecret as string, {
		expiresIn: '10m',
	})
}

const generateRefreshToken = (user: IUser) => {
	const config = useRuntimeConfig()

	return jwt.sign({ userId: user.id }, config.jwtRefreshSecret as string, {
		expiresIn: '12h',
	})
}

export const decodeRefreshToken = (token: string) => {
	const config = useRuntimeConfig()

	try {
		return jwt.verify(token, config.jwtRefreshSecret) as {
			userId: string
			iat: number
			exp: number
		}
	} catch (error) {
		return null
	}
}

export const decodeAccessToken = (token: string) => {
	const config = useRuntimeConfig()

	try {
		return jwt.verify(token, config.jwtAccessSecret) as {
			userId: string
			iat: number
			exp: number
		}
	} catch (error) {
		return null
	}
}

export const generateTokens = (user: IUser) => {
	const accessToken = generateAccessToken(user)
	const refreshToken = generateRefreshToken(user)

	return {
		accessToken,
		refreshToken,
	}
}

// TODO: set type
// "Cannot find name 'H3Event'. Did you mean 'Event'?"
export const sendRefreshToken = (event: any, token: string) => {
	setCookie(event, 'refresh_token', token, {
		httpOnly: true,
		sameSite: true,
	})
}
export const resetRefreshToken = (event: any) => {
	deleteCookie(event, 'refresh_token')
}
