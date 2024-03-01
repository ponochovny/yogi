<template>
	<div :class="{ dark: darkMode, 'bg-[#FEF3E4] min-h-screen': true }">
		<Transition>
			<LoadingPage v-if="isAuthLoading" />
		</Transition>
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
	transition: all 0.35s ease;
	&:hover {
		color: red;
	}
}
.v-enter-active,
.v-leave-active {
	transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>
