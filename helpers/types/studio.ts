import type { TOwner, TPractitioner, TUser } from '~/server/types'
import type { TMarker } from './map'
import type { IStudioResponse } from '~/server/types/studio'

export type TStudio = Omit<
	IStudioResponse,
	| 'logo'
	| 'banner'
	| 'owner'
	| 'practitioners'
	| 'location'
	| 'createdAt'
	| 'updatedAt'
	| 'ownerId'
> & {
	logo: { url: string }
	banner: { url: string }[]
	location: TMarker
	owner?: TOwner
	practitioners: TPractitioner[]
}
