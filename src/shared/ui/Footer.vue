<template>
	<footer class="flex flex-col gap-12 mt-20">
		<div v-if="variant !== 'white'" class="flex justify-between px-6">
			<div class="flex flex-col gap-12">
				<NuxtLink to="/" class="shrink-0 w-[100px] rounded-full bg-orange-200">
					<NuxtImg
						src="/img/logo.svg"
						alt="Yogi app"
						width="100"
						height="100"
					/>
				</NuxtLink>
				<ul class="flex gap-4">
					<li>
						<a
							href="#"
							aria-label="Facebook"
							class="w-10 h-10 rounded-full bg-white flex items-center justify-center fill-primary shadow-sm hover:bg-orange-400 hover:fill-white"
						>
							<span class="sr-only">Facebook</span>
							<Facebook :size="20" fill="#ea580c" :stroke-width="0" />
						</a>
					</li>
					<li>
						<a
							href="#"
							aria-label="Instagram"
							class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:bg-orange-400 hover:text-white"
						>
							<span class="sr-only">Instagram</span>
							<Instagram :size="20" :stroke-width="2" />
						</a>
					</li>
					<li>
						<a
							href="#"
							aria-label="Messenger"
							class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:bg-orange-400 hover:text-white"
						>
							<span class="sr-only">Messenger</span>
							<MessagesSquare :size="20" :stroke-width="2" />
						</a>
					</li>
				</ul>
				<div class="flex flex-col gap-6">
					<a class="font-semibold" href="mailto:ponochovny@gmail.com">
						ponochovny@gmail.com
					</a>
					<a class="font-semibold" href="tel:+18008080">+1 800-80-80</a>
				</div>
			</div>
			<!-- <div>col2</div> -->
		</div>
		<div class="flex gap-4 py-10 border-t border-slate-200 px-6">
			<span class="text-xs">Yogi © {{ new Date().getFullYear() }}</span>
			<NuxtLink to="/" class="text-xs">
				<span>Terms, Conditions & Privacy policy</span>
			</NuxtLink>
		</div>
	</footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Facebook, Instagram, MessagesSquare } from 'lucide-vue-next'

export default defineComponent({
	name: 'Footer',
	components: {
		Facebook,
		Instagram,
		MessagesSquare,
	},
})
</script>
<script lang="ts" setup>
interface IProps {
	variant?: 'white' | 'default'
}
defineProps<IProps>()
</script>
