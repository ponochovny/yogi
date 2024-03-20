import { prisma } from '.'

export interface IMediaFile {
	url: string
	providerPublicId: string
	bannerStudioId?: string | null
	logoStudioId?: string | null
	userId?: string
	logoOfferingId?: string | null
	bannerOfferingId?: string | null
}

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
