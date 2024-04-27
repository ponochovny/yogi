// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: false },
	modules: [
		'@nuxtjs/tailwindcss',
		'shadcn-nuxt',
		'nuxt-lodash',
		'nuxt-primevue',
		'@nuxt/image',
	],

	image: {
		cloudinary: {
			baseURL: 'https://res.cloudinary.com/dllruwqbd/image/fetch/',
		},
	},

	primevue: {
		components: {
			include: ['FileUpload'],
		},
	},

	shadcn: {
		prefix: '',
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
		// Stripe
		stripeSecretKey: process.env.STRIPE_SECRET_KEY,
		stripeEndpointSecret: process.env.ENDPOINT_SECRET,
		public: {
			appDomain: process.env.APP_DOMAIN,
			stripePublicKey: process.env.STRIPE_PUBLISHABLE_KEY,
		},
		// Mapbox
		mapboxPublicApi: process.env.MAPBOX_PUBLIC_API,
	},

	app: {
		head: {
			title: 'Yogi - Your wellness home',
			meta: [
				{ name: 'description', content: 'All you need for your wellness' },
			],
			htmlAttrs: {
				lang: 'en',
			},
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

	routeRules: {
		// '/**': { isr: 60 * 60 * 6 },
		// '/search': { ssr: false },
		'/user/**': { ssr: false },
		'/checkout': { ssr: false },
	},
})
