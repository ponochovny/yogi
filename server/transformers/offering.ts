import { mediaFileTransformer } from './mediaFiles'

// TODO: offering type
export const offeringTransformer = (offering: any) => {
	return {
		...offering,
		banners:
			offering.banners && offering.banners.length
				? offering.banners.map(mediaFileTransformer)
				: [],
	}
}
