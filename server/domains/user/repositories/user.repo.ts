import bcrypt from 'bcryptjs'
import { prisma } from '~/server/domains/shared'
import type { TCreateUserData, TUpdateProfileData } from '~/server/types/user'
import type { IUserResponse } from '~/server/types'

export const UserRepo = {
	create: (userData: TCreateUserData) => {
		const finalUserData = {
			...userData,
			password: bcrypt.hashSync(userData.password, 10),
		}
		return prisma.user.create({ data: finalUserData })
	},

	findByEmail: (email: string) => {
		return prisma.user.findUnique({
			where: { email },
			include: { avatars: true, studio: true },
		}) as unknown as Promise<IUserResponse | null>
	},

	findById: (id: string) => {
		return prisma.user.findUnique({
			where: { id },
			include: { studio: true },
		}) as unknown as Promise<IUserResponse | null>
	},

	searchByName: (string: string) => {
		return prisma.user.findRaw({
			filter: { name: { $regex: string, $options: 'i' } },
		})
	},

	update: (userId: string, newData: TUpdateProfileData) => {
		return prisma.user.update({
			where: { id: userId },
			data: { ...newData },
		})
	},
}
