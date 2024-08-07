<template>
	<form
		class="flex flex-col items-start w-full gap-4 max-w-96"
		@submit.prevent="handleAuth"
	>
		<Input
			v-if="mode === 'register'"
			v-model="data.name"
			label="Your name"
			placeholder="Your name"
			name="name"
			autocomplete="off"
		/>
		<Input
			v-model="data.email"
			label="Your e-mail"
			placeholder="Your e-mail"
			type="email"
			name="email"
			:autocomplete="mode !== 'register' ? 'on' : 'off'"
		/>
		<Input
			v-model="data.password"
			label="Your password"
			placeholder="********"
			type="password"
			name="password"
			:autocomplete="mode !== 'register' ? 'on' : 'off'"
		/>
		<Input
			v-if="mode === 'register'"
			v-model="data.repeatPassword"
			label="Repeat Your password"
			placeholder="********"
			type="password"
			name="repeatPassword"
			autocomplete="off"
		/>
		<Button type="submit" :disabled="data.loading" :loading="data.loading">
			<span class="font-bold text-white">
				{{ props.mode === 'register' ? 'Register' : 'Login' }}
			</span>
		</Button>
		<div class="flex gap-1 items-center text-sm">
			<template v-if="mode === 'login'">
				<span>Don't have an account?</span>
				<button type="button" @click="emit('mode', 'register')">
					<span class="font-semibold">Join now</span>
				</button>
			</template>
			<template v-else>
				<span>Already have an account?</span>
				<button type="button" @click="emit('mode', 'login')">
					<span class="font-semibold">Log in</span>
				</button>
			</template>
		</div>
	</form>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { toast } from 'vue-sonner'

export default defineComponent({
	name: 'AuthForm',
})
</script>
<script lang="ts" setup>
interface IProps {
	mode: 'register' | 'login'
}
const props = defineProps<IProps>()
const emit = defineEmits(['mode'])
const route = useRoute()

const data = reactive({
	name: '',
	email: '',
	password: '',
	repeatPassword: '',
	loading: false,
})

async function handleLogin(redirect?: string) {
	const { login } = useAuth()

	data.loading = true
	try {
		await login({
			email: data.email,
			password: data.password,
		})
		navigateTo(redirect ? '/' + redirect : '/')
	} catch (error: any) {
		toast.error(error.data.statusMessage)
		data.loading = false
	}
}
async function handleRegister(redirect?: string) {
	const { register } = useAuth()

	data.loading = true
	try {
		await register({
			name: data.name,
			email: data.email,
			password: data.password,
			repeatPassword: data.repeatPassword,
		})
		navigateTo(redirect ? '/' + redirect : '/')
	} catch (error: any) {
		toast.error(error.data.statusMessage)
		data.loading = false
	}
}

function handleAuth() {
	if (data.loading) return

	const redirect = route.query.redirect?.toString()
	props.mode === 'register' ? handleRegister(redirect) : handleLogin(redirect)
}
</script>
