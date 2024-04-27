<template>
	<div class="flex flex-col lg:flex-row lg:min-h-screen gap-10 lg:gap-0">
		<div
			class="min-h-full bg-orange-400 bg-[url('https://picsum.photos/500/1080?blur=9')] bg-no-repeat bg-cover bg-center flex flex-col items-start lg:gap-16 gap-10 pt-10 pb-10 lg:pb-0 lg:pt-36 pl-10 sm:pl-20 w-full lg:w-1/3"
		>
			<NuxtLink
				to="/"
				class="rounded-full bg-orange-200 hover:bg-orange-200/50 transition-colors duration-700 ease-out"
			>
				<img src="/img/logo.svg" alt="Yogi app" width="65" />
			</NuxtLink>
			<h1 class="text-3xl lg:text-4xl font-bold text-white">
				{{ mode === 'register' ? 'Register' : 'Login' }}
			</h1>
		</div>
		<div class="flex flex-col items-center justify-center flex-1 px-6 lg:px-0">
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
const router = useRouter()

onMounted(() => {
	if (route?.query?.t === 'register') mode.value = 'register'
})

function setMode(event: any) {
	mode.value = event

	if (event === 'login') {
		router.push({
			path: '/auth',
			query: {
				...route.query,
				t: 'login',
			},
		})
	} else {
		router.push({
			path: '/auth',
			query: {
				...route.query,
				t: 'register',
			},
		})
	}
}
</script>
