// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: false },
	modules: [
		'@nuxtjs/tailwindcss',
		'shadcn-nuxt',
		'nuxt-lodash',
		'@nuxt/image',
		'nuxt-swiper',
		'@vite-pwa/nuxt',
		'@vueuse/nuxt',
		'@vee-validate/nuxt',
		'@zadigetvoltaire/nuxt-gtm',
	],

	image: {
		cloudinary: {
			baseURL: 'https://res.cloudinary.com/dllruwqbd/image/fetch/',
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

	pwa: {
		manifest: {
			name: 'Yogiapp',
			short_name: 'Yogiapp',
			description:
				'Wellness marketplace, book your next appointment, retreat, festival',
			theme_color: '#FEF3E4',
			icons: [
				{
					src: 'pwa-icon-192x192.png',
					sizes: '192x192',
					type: 'image/png',
				},
				{
					src: 'pwa-icon-512x512.png',
					sizes: '512x512',
					type: 'image/png',
				},
			],
		},
		devOptions: {
			enabled: true,
			type: 'module',
		},
	},

	app: {
		head: {
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
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
		// '/**': { isr: 60 * 60 * 6 }, // TODO: home page search requests not working :/
		// '/search': { ssr: false }, // TODO: set useLazyFetch
		'/user/**': { ssr: false },
		'/checkout': { ssr: false },
	},

	// @ts-ignore
	gtm: {
		id: 'GTM-PZQGRSWW',
		enabled: true,
		debug: true,
	},
})
