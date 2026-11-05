import type { TMediaFile } from '~/src/app/types'
import type { IMediaFile } from '~/server/types'
import type { IBanner } from '~/server/types/offering'

export const toMediaFileDto = (mediaFile: IMediaFile | IBanner): TMediaFile => {
	return {
		id: mediaFile.id,
		url: mediaFile.url,
		order: mediaFile.order,
	}
}
