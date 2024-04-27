<template>
	<div class="relative max-w-screen-xl pt-3 mx-auto" :class="cn(props.class)">
		<Header />
		<div class="py-10">
			<div class="bg-white rounded-md flex">
				<div class="lg:pr-10 w-auto lg:w-full lg:max-w-[220px]">
					<AdminSidebar :menu-items="_userMenu" />
				</div>
				<div class="pl-6 md:pl-10 border-l pb-10 w-full">
					<slot />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { cn } from '@/lib/utils'
import { userMenu } from '~/helpers/adminPanel'

export default defineComponent({
	name: 'UserAdminLayout',
})
</script>
<script lang="ts" setup>
interface IProps {
	class?: string
}
const props = defineProps<IProps>()
const _userMenu = userMenu
</script>
