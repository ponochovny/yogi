import { mediaFileTransformer } from './mediaFiles'
import { userTransformer } from './user'

// TODO: set studio type
export const studioTransformer = (studio: any) => {
	const { createdAt, updatedAt, ...rest } = studio
	return {
		...rest,
		logo: studio.logo ? studio.logo.map(mediaFileTransformer) : null,
		banner: studio.banner ? studio.banner.map(mediaFileTransformer) : null,
		owner: userTransformer(studio.owner),
	}
}
