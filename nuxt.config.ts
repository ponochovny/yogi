import tailwindcss from '@tailwindcss/vite'
import { defineNuxtModule } from 'nuxt/kit'

const MODULES = [
	'shadcn-nuxt',
	'@nuxt/image',
	'nuxt-swiper',
	'@vite-pwa/nuxt',
	'@vueuse/nuxt',
	'@vee-validate/nuxt',
	'nuxt-gtag',
	'@pinia/nuxt',
	'nuxt-auth-utils',
]

const shadcnComponentBarrelFix = defineNuxtModule({
	setup(_, nuxt) {
		nuxt.hook('components:dirs', (dirs) => {
			const shadcnComponents = dirs.find(
				(dir) =>
					typeof dir !== 'string' &&
					dir.path.endsWith('/src/shared/ui/shadcn')
			)

			if (shadcnComponents && typeof shadcnComponents !== 'string') {
				shadcnComponents.ignore = [
					...(shadcnComponents.ignore || []),
					'**/index.ts',
				]
			}
		})
	},
})

export default defineNuxtConfig({
	devtools: { enabled: false },

	future: {
		compatibilityVersion: 4,
	},

	dir: {
		pages: './src/pages',
		assets: './src/app/assets',
	},

	css: ['~/src/app/assets/css/tailwind.css'],

	vite: {
		plugins: [tailwindcss()],
	},

	modules: [...MODULES, shadcnComponentBarrelFix],

	components: [
		{ path: '~/src/shared/ui', pattern: '!shadcn/**', extensions: ['.vue'] },
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

	pwa: {
		registerType: 'autoUpdate',
		manifest: {
			name: 'Yogi - Your wellness home',
			short_name: 'Yogi',
			description:
				'Wellness marketplace, book your next appointment, retreat, festival',
			theme_color: '#FEF3E4',
			background_color: '#FEF3E4',
			display: 'standalone',
			icons: [
				{
					src: '/pwa-icon-192x192.png',
					sizes: '192x192',
					type: 'image/png',
				},
				{
					src: '/pwa-icon-512x512.png',
					sizes: '512x512',
					type: 'image/png',
				},
			],
		},
		generateSW: {
			navigateFallback: '/',
			globPatterns: ['**/*.{js,css,html,png,svg,ico,woff,woff2}'],
			runtimeCaching: [
				{
					urlPattern: ({ request }) => request.mode === 'navigate',
					handler: 'NetworkFirst',
					options: {
						cacheName: 'pages-cache',
						expiration: {
							maxEntries: 50,
							maxAgeSeconds: 60 * 60 * 24 * 7,
						},
						networkTimeoutSeconds: 3,
					},
				},
				{
					urlPattern: ({ request }) =>
						request.destination === 'script' || request.destination === 'style',
					handler: 'StaleWhileRevalidate',
					options: {
						cacheName: 'static-resources',
						expiration: {
							maxEntries: 100,
							maxAgeSeconds: 60 * 60 * 24 * 30,
						},
					},
				},
				{
					urlPattern: ({ request }) =>
						request.destination === 'image' || request.destination === 'font',
					handler: 'CacheFirst',
					options: {
						cacheName: 'media-cache',
						expiration: {
							maxEntries: 100,
							maxAgeSeconds: 60 * 60 * 24 * 30,
						},
						cacheableResponse: {
							statuses: [0, 200],
						},
					},
				},
				{
					urlPattern: ({ url, request }) =>
						url.pathname.startsWith('/api/') && request.method === 'GET',
					handler: 'NetworkFirst',
					options: {
						cacheName: 'api-cache',
						expiration: {
							maxEntries: 50,
							maxAgeSeconds: 60 * 60 * 24,
						},
						networkTimeoutSeconds: 3,
						cacheableResponse: {
							statuses: [0, 200],
						},
					},
				},
			],
		},
		client: {
			installPrompt: true,
			periodicSyncForUpdates: 3600,
		},
		devOptions: {
			enabled: true,
			suppressWarnings: true,
			type: 'module',
		},
	},

	$production: {
		modules: [...MODULES],
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
					rel: 'icon',
					type: 'image/x-icon',
					href: '/logoBg.svg',
				},
			],
		},
	},

	routeRules: {
		'/': { isr: 60 * 60 },
		'/user/**': { ssr: false },
		'/checkout': { ssr: false },
	},

	compatibilityDate: '2025-01-19',
})
