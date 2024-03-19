import type { IUser } from '../types'
import { mediaFileTransformer } from './mediaFiles'
import { practitionerTransformer } from './user'

// TODO: offering type
export const offeringTransformer = (offering: any) => {
	return {
		...offering,
		banners:
			offering.banners && offering.banners.length
				? offering.banners.map(mediaFileTransformer)
				: [],
		practitioners: offering.practitioners.map((item: { user: IUser }) =>
			practitionerTransformer(item.user)
		),
	}
}
