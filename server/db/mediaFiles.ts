import { prisma } from '.'
import type { IMediaFile } from '../types'

export const createMediaFile = (mediaFile: IMediaFile) => {
	return prisma.mediaFile.create({
		data: mediaFile,
	})
}

export const deleteManyMediaFileByUserID = (userId: string) => {
	return prisma.mediaFile.deleteMany({
		where: {
			userId,
		},
	})
}
