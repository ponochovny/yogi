import type { IUserResponse } from '.'

export type TUpdateProfileData = Partial<
	Pick<IUserResponse, 'name' | 'email' | 'bio' | 'profileImage'>
>

export type TCreateUserData = Pick<
	IUserResponse,
	'name' | 'email' | 'password' | 'profileImage'
>
