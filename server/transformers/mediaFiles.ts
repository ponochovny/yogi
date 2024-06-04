import type { TMediaFile } from '~/helpers/types'
import type { IMediaFile } from '../types'
import type { IBanner } from '../types/offering'

// TODO: set media type
export const mediaFileTransformer = (
	mediaFile: IMediaFile | IBanner
): TMediaFile => {
	return {
		id: mediaFile.id,
		url: mediaFile.url,
		order: mediaFile.order,
	}
}
