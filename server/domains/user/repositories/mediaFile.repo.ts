import { prisma } from '~/server/domains/shared'
import type { IMediaFile } from '~/server/types'

export const MediaFileRepo = {
	create: (mediaFile: Omit<IMediaFile, 'id'>) => {
		return prisma.mediaFile.create({ data: mediaFile })
	},

	update: (id: string, data: Partial<Pick<IMediaFile, 'order'>>) => {
		return prisma.mediaFile.update({ where: { id }, data })
	},

	delete: (id: string) => {
		return prisma.mediaFile.delete({ where: { id } })
	},

	deleteManyByUserId: (userId: string) => {
		return prisma.mediaFile.deleteMany({ where: { userId } })
	},
}
