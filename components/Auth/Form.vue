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
		/>
		<Input
			v-model="data.email"
			label="Your e-mail"
			placeholder="Your e-mail"
			type="email"
		/>
		<Input
			v-model="data.password"
			label="Your password"
			placeholder="********"
			type="password"
		/>
		<Input
			v-if="mode === 'register'"
			v-model="data.repeatPassword"
			label="Repeat Your password"
			placeholder="********"
			type="password"
		/>
		<Button @click="handleAuth" type="submit">
			<span class="font-bold text-white">
				{{ props.mode === 'register' ? 'Register' : 'Login' }}
			</span>
		</Button>
	</form>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

export default defineComponent({
	name: 'AuthForm',
})
</script>
<script lang="ts" setup>
interface IProps {
	mode: 'register' | 'login'
}
const props = defineProps<IProps>()

const data = reactive({
	name: '',
	email: '',
	password: '',
	repeatPassword: '',
	loading: false,
})

async function handleLogin() {
	const { login } = useAuth()

	data.loading = true
	try {
		await login({
			email: data.email,
			password: data.password,
		})
		navigateTo('/')
	} catch (error) {
		console.log(error)
	} finally {
		data.loading = false
	}
}
async function handleRegister() {
	const { register } = useAuth()

	data.loading = true
	try {
		await register({
			name: data.name,
			email: data.email,
			password: data.password,
			repeatPassword: data.repeatPassword,
		})
		navigateTo('/')
	} catch (error) {
		console.log(error)
	} finally {
		data.loading = false
	}
}

function handleAuth() {
	props.mode === 'register' ? handleRegister() : handleLogin()
}
</script>
