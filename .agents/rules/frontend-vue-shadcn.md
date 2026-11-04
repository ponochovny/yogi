# Frontend Vue 3 & Shadcn Standards for Yogi

## 1. Vue 3 Composition API Standards

- **Script Setup**: Every component must use `<script setup lang="ts">`.
- **Props Definition**:
  ```vue
  <script setup lang="ts">
  interface Props {
  	title: string
  	isActive?: boolean
  	count?: number
  }

  const props = withDefaults(defineProps<Props>(), {
  	isActive: false,
  	count: 0,
  })
  </script>
  ```
- **Emits Definition**:
  ```vue
  <script setup lang="ts">
  const emit = defineEmits<{
  	(e: 'update:modelValue', value: string): void
  	(e: 'submit', payload: FormData): void
  }>()
  </script>
  ```
- **No Prop Mutation**: Never mutate a prop directly. Emit an event or use `v-model` with `defineModel()` where supported.

---

## 2. Shadcn Vue & Radix Primitives

- UI components based on Radix Vue and Shadcn are located in `src/shared/ui/shadcn/`.
- Use `cn(...)` utility (from `src/shared/lib/utils`) for class merging with `clsx` and `tailwind-merge`.
- Follow consistent styling tokens from `tailwind.config.ts`.
- Ensure accessibility:
  - Add appropriate `aria-*` attributes (`aria-expanded`, `aria-label`, `aria-haspopup`).
  - Ensure interactive elements are keyboard navigatable (proper `tabindex` and focus styles).

---

## 3. Forms & Validation

- Always use **VeeValidate** with **Zod** schemas for forms with validation:
  ```vue
  <script setup lang="ts">
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { z } from 'zod'

  const schema = toTypedSchema(
  	z.object({
  		email: z.string().email('Invalid email address'),
  		password: z.string().min(8, 'Password must be at least 8 characters'),
  	})
  )

  const { handleSubmit, errors, isSubmitting } = useForm({
  	validationSchema: schema,
  })

  const onSubmit = handleSubmit(async (values) => {
  	// execute typed submission
  })
  </script>
  ```

---

## 4. Nuxt Data Fetching & State

- When fetching data for page rendering:
  - Use `useAsyncData` or `useFetch` with an explicit unique key.
  - Set appropriate caching options or lazy options (`lazy: true`) for non-critical sections.
- When performing user actions (POST/PUT/DELETE):
  - Use typed `$fetch<T>` or `useFetchApi<T>`.
  - Handle loading state and toast feedback (via `vue-sonner`).
- **Store**: Use Pinia for cross-component global state (e.g. cart, current session). Use `useState` only for simple SSR-friendly isolated state.

