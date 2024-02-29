export interface IUser {
	id: string
	email: string
	password: string
	name: string | null
	profileImage: string | null
	interestsCategory: string[]
	interestsType: string[]

	createdAt: Date
	updatedAt: Date
}
