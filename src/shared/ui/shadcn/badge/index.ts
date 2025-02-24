import { type VariantProps, cva } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
	'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
	{
		variants: {
			variant: {
				default:
					'border-transparent bg-orange-600 text-white hover:bg-orange-600/80',
				secondary:
					'border-transparent bg-orange-400 text-white hover:bg-orange-400/80',
				destructive:
					'border-transparent bg-destructive text-white hover:bg-destructive/80',
				success:
					'border-transparent bg-emerald-600 text-emerald-600 hover:bg-emerald-600/80 text-white',
				blue: 'border-transparent bg-sky-600 text-sky-600 hover:bg-sky-600/80 text-white',
				gray: 'border-transparent bg-gray-600 text-gray-600 hover:bg-gray-600/80 text-white',
				outline: 'text-foreground',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
