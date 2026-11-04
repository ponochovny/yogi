import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { IUserResponse } from '../types'
import type { H3Event } from 'h3'

/**
 * JWT Payload interface
 */
export interface TokenPayload extends JwtPayload {
	userId: string
	iat: number
	exp: number
}

/**
 * Token pair interface for API responses
 */
export interface TokenPair {
	accessToken: string
	refreshToken: string
}

/**
 * Token configuration
 */
const TOKEN_CONFIG = {
	ACCESS_EXPIRES_IN: '15m', // 15 minutes
	REFRESH_EXPIRES_IN: '7d', // 7 days
}

/**
 * Generates access token
 */
const generateAccessToken = (user: IUserResponse): string => {
	const config = useRuntimeConfig()

	if (!config.jwtAccessSecret) {
		throw new Error('JWT_ACCESS_SECRET is not configured')
	}

	return jwt.sign({ userId: user.id }, config.jwtAccessSecret as string, {
		expiresIn: TOKEN_CONFIG.ACCESS_EXPIRES_IN,
	})
}

/**
 * Generates refresh token
 */
const generateRefreshToken = (user: IUserResponse): string => {
	const config = useRuntimeConfig()

	if (!config.jwtRefreshSecret) {
		throw new Error('JWT_REFRESH_SECRET is not configured')
	}

	return jwt.sign({ userId: user.id }, config.jwtRefreshSecret as string, {
		expiresIn: TOKEN_CONFIG.REFRESH_EXPIRES_IN,
	})
}

/**
 * Verifies and decodes refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload | null => {
	const config = useRuntimeConfig()

	if (!config.jwtRefreshSecret) {
		console.error('JWT_REFRESH_SECRET is not configured')
		return null
	}

	try {
		return jwt.verify(token, config.jwtRefreshSecret as string) as TokenPayload
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			console.warn('Refresh token has expired')
		} else if (error instanceof jwt.JsonWebTokenError) {
			console.warn('Invalid refresh token')
		}
		return null
	}
}

/**
 * Verifies and decodes access token
 */
export const verifyAccessToken = (token: string): TokenPayload | null => {
	const config = useRuntimeConfig()

	if (!config.jwtAccessSecret) {
		console.error('JWT_ACCESS_SECRET is not configured')
		return null
	}

	try {
		return jwt.verify(token, config.jwtAccessSecret as string) as TokenPayload
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			console.warn('Access token has expired')
		} else if (error instanceof jwt.JsonWebTokenError) {
			console.warn('Invalid access token')
		}
		return null
	}
}

/**
 * Generates a pair of access and refresh tokens
 */
export const generateTokens = (user: IUserResponse): TokenPair => {
	return {
		accessToken: generateAccessToken(user),
		refreshToken: generateRefreshToken(user),
	}
}

/**
 * Saves refresh token in HTTP-only cookie
 */
export const sendRefreshToken = (event: H3Event, token: string): void => {
	setCookie(event, 'refresh_token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
		path: '/',
	})
}

/**
 * Removes refresh token from cookies
 */
export const clearRefreshToken = (event: H3Event): void => {
	deleteCookie(event, 'refresh_token')
}
