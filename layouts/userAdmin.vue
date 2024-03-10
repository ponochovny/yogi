<template>
	<div class="max-w-screen-xl pt-3 mx-auto">
		<Header />
		<div class="pt-10">
			<div class="bg-white rounded-md flex">
				<div class="pr-10 w-full max-w-[220px]">
					<AdminSidebar :menu-items="_userMenu" />
				</div>
				<div class="pl-10 border-l pb-10 w-full">
					<slot />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { userMenu } from '~/helpers/adminPanel'

export default defineComponent({
	name: 'UserAdminLayout',
})
</script>
<script lang="ts" setup>
const _userMenu = userMenu
</script>
