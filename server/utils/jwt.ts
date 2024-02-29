import jwt from 'jsonwebtoken'
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
		expiresIn: '10m',
	})
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
	console.dir(event)
	console.dir(!!event.node.res)
	setCookie(event, 'refresh_token', token, {
		httpOnly: true,
		sameSite: true,
	})
}
