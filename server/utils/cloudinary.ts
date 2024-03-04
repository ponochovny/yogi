import { v2 as _cloudinary } from 'cloudinary'

export interface ICloudinaryResource {
	asset_id: string
	public_id: string
	version: number
	version_id: string
	signature: string
	width: number
	height: number
	format: string
	resource_type: string
	created_at: string
	tags: any[]
	pages: number
	bytes: number
	type: string
	etag: string
	placeholder: boolean
	url: string
	secure_url: string
	folder: string
	access_mode: string
	original_filename: string
	api_key: string
}

const cloudinary = () => {
	const config = useRuntimeConfig()

	_cloudinary.config({
		cloud_name: config.cloudinaryCloudName,
		api_key: config.cloudinaryApiKey,
		api_secret: config.cloudinaryApiSecret,
	})

	return _cloudinary
}

export const uploadToCloudinary = (
	image: string
): Promise<ICloudinaryResource> => {
	return new Promise((resolve, reject) => {
		cloudinary().uploader.upload(
			image,
			(error: any, data: ICloudinaryResource) => {
				if (error) {
					reject(error)
				}
				resolve(data)
			}
		)
	})
}
