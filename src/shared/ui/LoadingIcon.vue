<template>
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle class="spinner_I8Q1" cx="4" cy="12" r="1.5" />
		<circle class="spinner_I8Q1 spinner_vrS7" cx="12" cy="12" r="3" />
		<circle class="spinner_I8Q1" cx="20" cy="12" r="1.5" />
	</svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'LoadingIcon',
})
</script>
<script lang="ts" setup></script>
<style>
.spinner_I8Q1 {
	animation: spinner_qhi1 0.75s linear infinite;
}
.spinner_vrS7 {
	animation-delay: -0.375s;
}
@keyframes spinner_qhi1 {
	0%,
	100% {
		r: 1.5px;
	}
	50% {
		r: 3px;
	}
}
</style>
