import type {
	Stripe,
	StripeElements,
	StripePaymentElement,
} from '@stripe/stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { absoluteUrl } from '~/lib/utils'

export default (
	injectId: string,
	{
		amount,
		currency,
		ticket_id,
	}: { amount: number; currency: string; ticket_id: string }
) => {
	const config = useRuntimeConfig()
	const { useAuthUser } = useAuth()
	const authUser = useAuthUser()

	const loading = ref(true)
	const error = ref<string | null>(null)
	let stripe: Stripe | null
	let elements: StripeElements
	let paymentElement: StripePaymentElement
	const paymentData = reactive({
		amount,
		currency,
	})
	const router = useRouter()
	const return_url = absoluteUrl('/success')
	const appearance = {
		// theme: 'night',
		variables: {
			colorPrimary: 'rgb(251 146 60)',
		},
	}

	const injectStripe = async () => {
		try {
			stripe = await loadStripe(config.public.stripePublicKey)

			if (stripe) {
				elements = stripe.elements({
					mode: 'payment',
					amount,
					currency,
					appearance,
				})

				paymentElement = elements.create('payment')
				paymentElement.on('ready', () => {
					loading.value = false
				})
				paymentElement.mount(injectId)
			} else {
				error.value = 'Failed to initialize Stripe'
			}
		} catch (err) {
			error.value = 'Failed to initialize Stripe'
		}
	}

	const handleSubmitStripeForm = async (e: Event) => {
		if (loading.value) return
		if (!stripe || !elements) return

		loading.value = true

		const { error: submitError } = await elements.submit()
		if (submitError) {
			console.log('submitError', submitError)
			loading.value = false
			return
		}

		const { name, email } = Object.fromEntries(
			new FormData(e.target as HTMLFormElement)
		)

		try {
			const res = await $fetch('/api/stripe', {
				method: 'POST',
				body: {
					amount: paymentData.amount,
					currency: paymentData.currency,
					ticket_id,
					user_id: authUser.value ? authUser.value.id : null,
					user_name: name ? name : null,
				},
			})

			const { secret: clientSecret } = res as any

			const { error } = await stripe.confirmPayment({
				elements,
				clientSecret,
				confirmParams: {
					receipt_email: email ? (email as string) : undefined,
					return_url,
				},
			})
			if (error.type === 'card_error' || error.type === 'validation_error') {
				router.push('/error')
			} else {
				console.log('great', error)
			}
		} catch (error) {
			console.log('error', error)
			router.push('/error')
		} finally {
			loading.value = false
		}
	}

	const refetch = ({
		amount,
		currency,
	}: {
		amount: number
		currency: string
	}) => {
		paymentData.amount = amount
		paymentData.currency = currency

		paymentElement.unmount()

		if (stripe) {
			elements = stripe.elements({
				mode: 'payment',
				amount,
				currency,
				appearance,
			})

			paymentElement = elements.create('payment')

			paymentElement.mount(injectId)
		}
	}

	onUnmounted(() => {
		if (paymentElement) {
			paymentElement.destroy()
		}
	})

	return {
		injectStripe,
		handleSubmitStripeForm,
		loading,
		error,
		refetch,
	}
}
