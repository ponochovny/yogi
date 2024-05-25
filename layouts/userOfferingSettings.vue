<template>
	<div class="relative max-w-screen-xl pt-3 mx-auto">
		<Header class="px-4 xl:px-0" />
		<div class="py-10">
			<div class="bg-white rounded-md flex">
				<div class="lg:pr-10 w-auto lg:w-full lg:max-w-[220px]">
					<AdminSidebar :menu-items="_menuItems" />
				</div>
				<div class="border-l pb-10 w-full">
					<slot />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { userOfferingSettingsMenu } from '~/helpers/adminPanel'

export default defineComponent({
	name: 'UserAdminLayout',
})
</script>
<script lang="ts" setup>
const props = defineProps<{ creation?: boolean }>()
const _menuItems = userOfferingSettingsMenu(props.creation)
</script>
