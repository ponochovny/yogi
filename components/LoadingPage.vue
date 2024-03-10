<template>
	<div
		class="z-20 fixed inset-0 bg-[#FEF3E4] flex items-center justify-center h-screen"
	>
		<div class="absolute w-20 h-20 animate-ping">
			<img src="/img/logo.svg" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'LoadingPage',
})
</script>
<script lang="ts" setup></script>
