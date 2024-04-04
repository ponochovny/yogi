import { prisma } from '.'

export const getRefreshToken = (token: string) =>
	prisma.refreshToken.findUnique({
		where: { token },
	})

export const createRefreshToken = (refreshToken: {
	token: string
	userId: string
}) => {
	return prisma.refreshToken.create({
		data: refreshToken,
	})
}
export const deleteRefreshToken = (refreshToken: any) => {
	return prisma.refreshToken.delete({
		where: {
			token: refreshToken,
		},
	})
}

export const getRefreshTokenByToken = (token: string) => {
	return prisma.refreshToken.findUnique({
		where: {
			token,
		},
	})
}
