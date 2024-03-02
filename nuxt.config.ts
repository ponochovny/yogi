// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	// devtools: { enabled: true }
	modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', 'nuxt-lodash'],

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

	runtimeConfig: {
		jwtAccessSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
		jwtRefreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
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
