<template>
	<div class="flex min-h-screen">
		<div
			class="w-1/3 min-h-full bg-orange-400 bg-[url('https://picsum.photos/500/1080?blur=9')] bg-no-repeat bg-cover bg-center flex flex-col items-start gap-16 pt-36 pl-20"
		>
			<NuxtLink
				to="/"
				class="rounded-full bg-orange-200 hover:bg-orange-200/50 transition-colors duration-700 ease-out"
			>
				<img src="/img/logo.svg" alt="Yogi app" width="65" />
			</NuxtLink>
			<h1 class="text-4xl font-bold text-white">
				{{ mode === 'register' ? 'Register' : 'Login' }}
			</h1>
		</div>
		<div class="flex flex-col items-center justify-center flex-1">
			<AuthForm :mode="mode" @mode="setMode" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'AuthPage',
})
</script>
<script lang="ts" setup>
definePageMeta({
	middleware: ['auth'],
})

const mode = ref<'login' | 'register'>('login')

const route = useRoute()

onMounted(() => {
	if (route?.query?.t === 'register') mode.value = 'register'
})

function setMode(event: any) {
	mode.value = event

	if (event === 'login') {
		useRouter().replace({ path: '/auth' })
	} else {
		useRouter().push({
			path: '/auth',
			query: {
				t: 'register',
			},
		})
	}
}
</script>
