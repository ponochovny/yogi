<template>
	<div :class="{ dark: darkMode }">
		<img src="/img/logo.svg" alt="Yogi app" width="65" />
		<h1>Yogi app!</h1>
	</div>
</template>
<script setup>
const darkMode = ref(false)
</script>
