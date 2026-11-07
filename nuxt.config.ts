const MODULES = [
	'@nuxtjs/tailwindcss',
	'shadcn-nuxt',
	'nuxt-lodash',
	'@nuxt/image',
	'nuxt-swiper',
	'@vite-pwa/nuxt',
	'@vueuse/nuxt',
	'@vee-validate/nuxt',
	'nuxt-gtag',
	'@pinia/nuxt',
	'nuxt-auth-utils',
]
const PROD_MODULES = ['@zadigetvoltaire/nuxt-gtm']

export default defineNuxtConfig({
	devtools: { enabled: false },

	future: {
		compatibilityVersion: 4,
	},

	dir: {
		pages: './src/pages',
		assets: './src/app/assets',
	},

	modules: [...MODULES],

	components: [
		{ path: '~/src/shared/ui', extensions: ['.vue'] },
		{ path: '~/src/entities', extensions: ['.vue'], pathPrefix: false },
		{ path: '~/src/features', extensions: ['.vue'], pathPrefix: false },
		{ path: '~/src/widgets', extensions: ['.vue'], pathPrefix: false },
	],

	image: {
		cloudinary: {
			baseURL: 'https://res.cloudinary.com/dllruwqbd/image/fetch/',
		},
	},

	shadcn: {
		prefix: '',
		componentDir: './src/shared/ui/shadcn',
	},

	build: {
		transpile: ['@heroicons/vue'],
	},

	runtimeConfig: {
		// Session (nuxt-auth-utils)
		session: {
			password: process.env.NUXT_SESSION_PASSWORD || '',
			maxAge: 60 * 60 * 24 * 7, // 7 days
		},
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

	$production: {
		modules: [...MODULES, ...PROD_MODULES],
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
		// @ts-ignore
		gtm: {
			id: process.env.GOOGLE_TAG_MANAGER_ID || '',
			enabled: true,
			debug: true,
		},

		gtag: {
			id: process.env.GOOGLE_TAG_ID,
		},
	},

	app: {
		head: {
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1',
			title: 'Yogi - Your wellness home',
			meta: [
				{ name: 'description', content: 'All you need for your wellness' },
				{ name: 'theme-color', content: '#FEF3E4' },
			],
			htmlAttrs: {
				lang: 'en',
				class: 'bg-[#FEF3E4]',
			},
			bodyAttrs: {
				class: 'bg-[#FEF3E4]',
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
		'/': { isr: 60 * 60 * 24 },
		'/user/**': { ssr: false },
		'/checkout': { ssr: false },
	},

	compatibilityDate: '2025-01-19',
})
