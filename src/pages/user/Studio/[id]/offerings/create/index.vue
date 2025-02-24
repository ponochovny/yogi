<template>
	<NuxtLayout name="user-admin" creation>
		<div class="pr-6 md:pr-10 py-14">
			<h2 class="text-2xl font-bold mb-6">Offering creation</h2>
			<OfferingCreation class="px-1" />
		</div>
	</NuxtLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'CreateOffering',
})
</script>
<script lang="ts" setup></script>
