import { prisma } from '.'

// TODO: type
export const createMediaFile = (mediaFile: any) => {
	return prisma.mediaFile.create({
		data: mediaFile,
	})
}
