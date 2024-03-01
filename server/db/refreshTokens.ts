import { prisma } from '.'

// TODO: set type
export const createRefreshToken = (refreshToken: any) => {
	return prisma.refreshToken.create({
		data: refreshToken,
	})
}

export const getRefreshTokenByToken = (token: string) => {
	return prisma.refreshToken.findUnique({
		where: {
			token,
		},
	})
}
