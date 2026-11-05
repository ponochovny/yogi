import bcrypt from 'bcryptjs'
import { UserRepo, toUserDto } from '~/server/domains/user'
import { badRequest, unauthorized } from '~/server/domains/shared'
import type { TLoginInput, TRegisterInput } from '../model/schemas'

export const AuthService = {
	validateCredentials: async ({ email, password }: TLoginInput) => {
		const user = await UserRepo.findByEmail(email)

		if (!user) throw unauthorized('Invalid email or password')

		const isPasswordValid = await bcrypt.compare(password, user.password)
		if (!isPasswordValid) throw unauthorized('Invalid email or password')

		return toUserDto(user)
	},

	createAccount: async ({
		name,
		email,
		password,
	}: Omit<TRegisterInput, 'repeatPassword'> & { name: string }) => {
		const userExists = await UserRepo.findByEmail(email)
		if (userExists) throw badRequest('Email is already registered')

		const user = await UserRepo.create({
			name,
			email,
			password,
			profileImage: 'https://picsum.photos/200/200',
		})

		return toUserDto(user)
	},
}
