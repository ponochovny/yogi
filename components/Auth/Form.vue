<template>
	<form
		class="flex flex-col items-start w-full gap-4 max-w-96"
		@submit.prevent="handleLogin"
	>
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
		<Button @click="handleLogin" type="submit">
			<span class="font-bold text-white">Login</span>
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
const data = reactive({
	email: '',
	password: '',
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
</script>
