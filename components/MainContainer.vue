<template>
	<div class="max-w-screen-xl pt-3 mx-auto">
		<Header />

		<div>
			<slot />
		</div>

		<Footer />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'MainContainer',
})
</script>
<script lang="ts" setup></script>
