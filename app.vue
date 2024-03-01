<template>
	<div :class="{ dark: darkMode, 'bg-[#FEF3E4] min-h-screen': true }">
		<LoadingPage v-if="isAuthLoading" />
		<NuxtPage />
	</div>
</template>
<script setup>
const { initAuth, useAuthLoading } = useAuth()
const isAuthLoading = useAuthLoading()
const darkMode = ref(false)

onBeforeMount(() => {
	initAuth()
})
</script>
<style lang="scss">
a {
	color: black;
	&:hover {
		color: red;
	}
}
</style>
