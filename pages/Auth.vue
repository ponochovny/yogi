<template>
	<div class="flex min-h-screen">
		<div
			class="w-1/3 min-h-full bg-orange-400 bg-[url('https://picsum.photos/500/1080?blur=9')] bg-no-repeat bg-cover bg-center flex pt-64 pl-20"
		>
			<h1 class="text-4xl font-bold text-white">
				{{ mode === 'register' ? 'Register' : 'Login' }}
			</h1>
		</div>
		<div class="flex flex-col items-center justify-center flex-1">
			<AuthForm :mode="mode" />
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

onBeforeMount(() => {
	if (route?.query?.t === 'register') mode.value = 'register'
})
</script>
