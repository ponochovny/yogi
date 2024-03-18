// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	// devtools: { enabled: true }
	modules: [
		'@nuxtjs/tailwindcss',
		'shadcn-nuxt',
		'nuxt-lodash',
		'nuxt-primevue',
		'@nuxt/image',
	],

	primevue: {
		components: {
			include: ['FileUpload'],
		},
	},

	// @ts-ignore
	shadcn: {
		/**
		 * Prefix for all the imported component
		 */
		prefix: '',
		/**
		 * Directory that the component lives in.
		 * @default "./components/ui"
		 */
		componentDir: './components/ui',
	},

	build: {
		transpile: ['@heroicons/vue'],
	},

	runtimeConfig: {
		jwtAccessSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
		jwtRefreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
		// Cloudinary
		cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
		cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
		cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
	},

	app: {
		head: {
			link: [
				{
					hid: 'icon',
					rel: 'icon',
					type: 'image/x-icon',
					href: '/logoBg.svg',
				},
			],
		},
	},
})
