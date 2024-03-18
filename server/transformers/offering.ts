import type { IUser } from '../types'
import { mediaFileTransformer } from './mediaFiles'
import { userTransformer } from './user'

// TODO: offering type
export const offeringTransformer = (offering: any) => {
	return {
		...offering,
		banners:
			offering.banners && offering.banners.length
				? offering.banners.map(mediaFileTransformer)
				: [],
		practitioners: offering.practitioners.map((item: { user: IUser }) =>
			userTransformer(item.user)
		),
	}
}
