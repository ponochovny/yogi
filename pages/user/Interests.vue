<template>
	<div class="p-10">
		<div class="bg-white rounded-md flex">
			<div class="pr-10 w-full max-w-[200px]">
				<AdminSidebar :menu-items="userMenu" />
			</div>
			<div class="pl-10 border-l pb-10 w-full max-w-[600px]">
				<div class="max-w-[600px]">
					<h1 class="pt-8 text-2xl font-bold mb-6">Interests</h1>
					<div class="flex flex-col gap-8">
						<div class="flex flex-col gap-3">
							<span class="text-sm font-bold text-gray-700">
								Choose categories you’re interested in
							</span>
							<div class="flex gap-2 flex-wrap">
								<button
									v-for="category of data.categories"
									class="px-4 py-2 rounded-full bg-white border"
								>
									{{ category.name }}
								</button>
							</div>
						</div>
						<div class="flex flex-col gap-3">
							<span class="text-sm font-bold text-gray-700">
								Choose offering types you’re interested in
							</span>
							<div class="flex gap-2 flex-wrap">
								<button
									v-for="type of data.types"
									class="px-4 py-2 rounded-full bg-white border"
								>
									{{ type.name }}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { userMenu } from '~/helpers/adminPanel'
import data from '~/helpers/offeringAttributes.json'

export default defineComponent({
	name: 'InterestsPage',
})
</script>
<script lang="ts" setup></script>
