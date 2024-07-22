import { type VariantProps, cva } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
	'inline-flex items-center transition duration-300 ease-in-out disabled:cursor-default disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default:
					'bg-primary text-white rounded-full hover:bg-orange-600/75 active:bg-orange-600/60 hover:text-white disabled:bg-orange-600/50 disabled:opacity-70',
				destructive:
					'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				destructiveOutline:
					'border border-rose-600/30 bg-transparent text-rose-600 rounded-full hover:bg-rose-400/10 hover:text-rose-600 active:bg-rose-400/5 ring ring-rose-300/0 active:ring-rose-300 active:ring-opacity-50 disabled:ring-0',
				successOutline:
					'border border-emerald-600/30 bg-transparent text-emerald-600 rounded-full hover:bg-emerald-400/10 hover:text-emerald-600 active:bg-emerald-400/5 disabled:bg-transparent disabled:opacity-70 ring ring-emerald-300/0 active:ring-emerald-300 active:ring-opacity-50 disabled:ring-0',
				outline:
					'border border-orange-600/30 bg-transparent text-primary rounded-full hover:bg-orange-400/10 hover:text-primary active:bg-orange-400/5 ring ring-orange-300/0 active:ring-orange-300 active:ring-opacity-50 disabled:ring-0',
				secondary:
					'bg-secondary text-secondary-foreground hover:bg-orange-400/80',
				ghost:
					'bg-transparent text-primary rounded-full hover:bg-orange-400/10 hover:text-primary active:bg-orange-400/5',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'px-8 py-2',
				sm: 'px-3 py-1',
				md: 'px-4 py-2',
				// lg: 'px-8 py-2',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
