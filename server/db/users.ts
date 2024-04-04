import bcrypt from 'bcryptjs'
import { prisma } from '.'
import type { IUser } from '../types'

export const createUser = (
	userData: Pick<IUser, 'name' | 'email' | 'password' | 'profileImage'>
) => {
	const finalUserData = {
		...userData,
		password: bcrypt.hashSync(userData.password, 10),
	}

	return prisma.user.create({
		data: finalUserData,
	})
}

export const getUserByEmail = (email: string) => {
	return prisma.user.findUnique({
		where: {
			email,
		},
		include: {
			avatars: true,
		},
	})
}

export const getUsersByString = (string: string) => {
	return prisma.user.findRaw({
		filter: {
			// $or: [
			// 	{ email: { $regex: string } },
			// 	{ name: { $regex: string, $options: 'i' } },
			// ],
			name: { $regex: string, $options: 'i' },
		},
	})
}

export const getUserById = (id: string) => {
	return prisma.user.findUnique({
		where: {
			id,
		},
	})
}

export const updateProfile = (
	userId: string,
	newData: Partial<Pick<IUser, 'name' | 'email' | 'bio' | 'profileImage'>>
) => {
	return prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			...newData,
		},
	})
}
