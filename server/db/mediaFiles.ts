import { prisma } from '.'

export interface IMediaFile {
	url: string
	providerPublicId: string
	logoStudioId?: string
	bannerStudioId?: string
	userId?: string
}

export const createMediaFile = (mediaFile: IMediaFile) => {
	return prisma.mediaFile.create({
		data: mediaFile,
	})
}
