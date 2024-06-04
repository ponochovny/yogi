import { prisma } from '.'
import type { IMediaFile } from '../types'

export const createMediaFile = (mediaFile: Omit<IMediaFile, 'id'>) => {
	return prisma.mediaFile.create({
		data: mediaFile,
	})
}

export const updateMediaFile = (
	id: string,
	data: Partial<Pick<IMediaFile, 'order'>>
) => {
	return prisma.mediaFile.update({
		where: {
			id,
		},
		data,
	})
}

export const deleteMediaFile = (id: string) => {
	return prisma.mediaFile.delete({
		where: {
			id,
		},
	})
}

export const deleteManyMediaFileByUserID = (userId: string) => {
	return prisma.mediaFile.deleteMany({
		where: {
			userId,
		},
	})
}
