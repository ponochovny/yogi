import { mediaFileTransformer } from './mediaFiles'
import { userTransformer } from './user'

// TODO: set studio type
export const studioTransformer = (studio: any) => {
	const { createdAt, updatedAt, ownerId, ...rest } = studio
	return {
		...rest,
		logo:
			studio.logo && studio.logo.length
				? Array.of(studio.logo.pop()).map(mediaFileTransformer)
				: [],
		banner:
			studio.banner && studio.banner.length
				? Array.of(studio.banner.pop()).map(mediaFileTransformer)
				: [],
		owner: userTransformer(studio.owner),
	}
}
