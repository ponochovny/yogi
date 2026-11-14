import { UserRepo } from '../repositories/user.repo'
import { MediaFileRepo } from '../repositories/mediaFile.repo'
import { toUserDto } from '../transformers/user.dto'
import { uploadToCloudinary } from '~/server/domains/shared'
import { badRequest, notFound } from '~/server/domains/shared'

export const UserService = {
	getById: async (id: string) => {
		const user = await UserRepo.findById(id)
		if (!user) throw notFound('User not found')
		return toUserDto(user)
	},

	searchByName: async (query: string) => {
		return UserRepo.searchByName(query)
	},

	updateProfile: async (
		userId: string,
		data: {
			name?: string
			email?: string
			bio?: string
			interestsCategory?: string | string[]
			interestsType?: string | string[]
		},
		avatarFile?: { filepath: string }
	) => {
		if (!userId) throw badRequest('No user id provided')

		if (data.email) {
			if (!data.name) throw badRequest('Invalid params')
			const existing = await UserRepo.findByEmail(data.email)
			if (existing && existing.id !== userId) throw badRequest('Email is taken')
		}

		let profileImage: string | undefined

		if (avatarFile) {
			const cloudinaryResource = await uploadToCloudinary(avatarFile.filepath)
			await MediaFileRepo.deleteManyByUserId(userId)
			await MediaFileRepo.create({
				url: cloudinaryResource.secure_url,
				providerPublicId: cloudinaryResource.public_id,
				userId,
			})
			profileImage = cloudinaryResource.secure_url
		}

		const formatInterests = (value?: string | string[]) => {
			if (value === undefined) return undefined
			if (Array.isArray(value)) return value
			if (typeof value === 'string') {
				return value.length > 0 ? value.split(',').filter(Boolean) : []
			}
			return []
		}

		const updatedUser = await UserRepo.update(userId, {
			email: data.email,
			name: data.name,
			bio: data.bio,
			...(profileImage !== undefined ? { profileImage } : {}),
			interestsType: formatInterests(data.interestsType),
			interestsCategory: formatInterests(data.interestsCategory),
		})

		return {
			user: toUserDto(updatedUser),
		}
	},
}
