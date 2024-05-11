<template>
	<div>
		<datepicker
			v-if="dateModel"
			ref="datepickerRef"
			:modelValue="dateModel"
			@update:model-value="handleDate"
			:enable-time-picker="timePicker"
			calendar-class-name="dp__instance_calendar px-0"
			calendar-cell-class-name="text-sm sm:text-xs flex items-center justify-center text-basic-800 p-0 rounded-md sm:h-10 sm:w-10 !hover:bg-red-50"
			menuClassName="dropdown_calendar sm:justify-between w-full shadow-none"
			inline
			hide-offset-dates
			:model-auto="!noRange"
			:range="!noRange"
			@internalModelChange="onInternalPickerChange"
			auto-apply
			:time-picker="timePicker"
			:start-time="startTime"
			:month-change-on-scroll="false"
			:min-date="minDate"
			:max-date="maxDate"
		>
			<template #arrow-left>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M14.5 17L9.5 12L14.5 7"
						stroke="#808384"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</template>
			<template #arrow-right>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M9.5 17L14.5 12L9.5 7"
						stroke="#808384"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</template>
			<template #calendar-header="{ day }">
				<div class="text-basic-400 font-normal">
					{{ day[0] }}
				</div>
			</template>
			<template #day="{ day }">
				{{ day || '' }}
			</template>
			<!-- <template v-if="!noRange" #right-sidebar>
				<div class="p-1" :class="{ 'hidden lg:block': desktopOnlySidebar }">
					<template v-if="sidebarPrev">
						<ui-list-item @click="onGenerateDate('today')">
							<span class="whitespace-nowrap">Today</span>
						</ui-list-item>
						<ui-list-item @click="onGenerateDate('yesterday')">
							<span class="whitespace-nowrap">Yesterday</span>
						</ui-list-item>
						<ui-list-item @click="onGenerateDate('thisMonth')">
							<span class="whitespace-nowrap">This month</span>
						</ui-list-item>
						<ui-list-item @click="onGenerateDate('lastMonth')">
							<span class="whitespace-nowrap">Last month</span>
						</ui-list-item>
					</template>
					<template v-else>
						<ui-list-item @click="onGenerateDate('tomorrow')">
							<span class="whitespace-nowrap">Tomorrow</span>
						</ui-list-item>
						<ui-list-item @click="onGenerateDate('week')">
							<span class="whitespace-nowrap">Current week</span>
						</ui-list-item>
						<ui-list-item @click="onGenerateDate('nextWeek')">
							<span class="whitespace-nowrap">Next week</span>
						</ui-list-item>
						<ui-list-item @click="onGenerateDate('thisMonth')">
							<span class="whitespace-nowrap">Current month</span>
						</ui-list-item>
						<ui-list-item @click="onGenerateDate('nextMonth')">
							<span class="whitespace-nowrap">Next month</span>
						</ui-list-item>
					</template>
					<button
						v-if="canClear"
						type="button"
						class="text-coral-500 mt-6 ml-3 leading-6"
						@click="clear"
					>
						clear
					</button>
				</div>
			</template> -->

			<!-- <template #month-year="{ month, year, handleMonthYearChange }">
				<div class="flex justify-between w-full">
					<button @click="handleMonthYearChange(false)">
						<IconChevronLeftCalendar />
					</button>
					{{ format(new Date(year, month, 1), 'MMMM y') }}
					<button @click="handleMonthYearChange(true)">
						<IconChevronLeftCalendar class="rotate-180" />
					</button>
				</div>
			</template> -->
		</datepicker>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default defineComponent({
	name: 'CalendarPicker',
})
</script>
<script lang="ts" setup>
interface IProps {
	modelValue: Date[] | Date
	noRange?: boolean
	timePicker?: boolean
	minDate?: any
	maxDate?: any
	// initialTime?: Date | null
	// initialDate?: Date | null
	// tracker?: any[] | Date | null | undefined
	// edit?: boolean
	// canClear?: boolean
	// sidebarPrev?: boolean
	// desktopOnlySidebar?: boolean
}
const props = defineProps<IProps>()
const emit = defineEmits(['update:modelValue'])
const dateModel = ref()
function handleDate(data: Date[] | Date) {
	dateModel.value = data
	emit('update:modelValue', data)
}
const onInternalPickerChange = (v: any) => {
	//
}
const startTime = ref<{ hours: number; minutes: number } | undefined>(undefined)
onMounted(() => {
	dateModel.value = props.modelValue
})
</script>

<style lang="scss">
// General
// $dp__font_family: 'Ambit', sans-serif !default; // Font size for the menu
$dp__border_radius: 16px !default; // Border radius everywhere
$dp__cell_border_radius: $dp__border_radius !default; // Specific border radius for the calendar cell

// Transitions
$dp__transition_length: 22px !default; // Passed to the translateX in animation
$dp__transition_duration: 0.1s !default; // Transition duration

// Sizing
$dp__button_height: 35px !default; // size for buttons in overlays
$dp__month_year_row_height: 35px !default; // height of the month-year select row
$dp__month_year_row_button_size: 25px !default; // Specific height for the next/previous buttons
$dp__button_icon_height: 20px !default; // icon sizing in buttons
$dp__cell_size: 40px !default; // width and height of calendar cell
$dp__cell_padding: 0 !default; // padding in the cell
$dp__common_padding: 10px !default;
$dp__input_padding: 8px 16px !default; // padding in the input
$dp__input_icon_padding: 36px !default; // Padding on the left side of the input if icon is present
$dp__menu_min_width: 260px !default; // Adjust the min width of the menu
$dp__action_buttons_padding: 2px 5px !default; // Adjust padding for the action buttons in action row
$dp__row_margin: 5px 0 !default; // Adjust the spacing between rows in the calendar
$dp__calendar_header_cell_padding: 0.5rem !default; // Adjust padding in calendar header cells
$dp__two_calendars_spacing: 10px !default; // Space between two calendars if using two calendars
$dp__overlay_col_padding: 3px !default; // Padding in the overlay column
$dp__time_inc_dec_button_size: 32px !default; // Sizing for arrow buttons in the time picker

// Font sizes
$dp__font_size: 1rem !default; // overall font-size
$dp__preview_font_size: 0.8rem !default; // font size of the date preview in the action row
$dp__time_font_size: 2rem !default; // font size in the time picker

// @import '@/node_modules/@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss';

// dropdown calendar
.dropdown_calendar {
	.dp__instance_calendar {
		padding: 0;
		// padding-right: 16px;
	}
	.dp__cell_offset {
		&:hover {
			background: none;
		}
	}
}
//

.dp__calendar_header_item,
.dp__cell_inner {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0;
	width: 40px;
	height: 40px;
}

.dp__cell_inner {
	border-radius: 100%;
}

.dp__instance_calendar {
	padding: 12px 16px;
}

.dp__cell_inner {
	font-weight: 400;
	font-size: 14px;
	line-height: 24px;
}

.slot-icon,
.dp__inner_nav svg {
	height: 24px;
	width: 24px;
}

.dp__input {
	border: 1px solid #dde0e0;
	border-radius: 8px;
	padding: 8px 16px;

	font-size: 15px;
	line-height: 24px;

	color: #0b0f0f;

	&:hover {
		border-color: #dde0e0;
	}

	&.dp__input_invalid {
		box-shadow: none;
		border: 1px solid #ff5e46;
	}
}
.dp__input_focus {
	border: 1px solid #ff5e46 !important;
}
.dp__input_icon {
	position: absolute;
	right: 12px;
	left: auto;
}
.dp__input_icon_pad {
	padding-right: calc(12px + 24px) !important;
}

.dp__inc_dec_button {
	padding: 0;
}

.dp__time_col {
	font-size: 2rem;
	line-height: 2.2rem;
}
.dp__time_display,
.dp__time_display:hover {
	background: none;
}

// .dp__overlay {
// overflow: hidden;
// @apply shadow-5;
// }
.dp__time_input {
	.dp__overlay {
		overflow-y: auto;
	}
}

.dp__action_row {
	padding: 10px 16px;
}

.dp__menu {
	border-radius: 16px;
	overflow: hidden;
	border: none;
	// @apply shadow-md;

	@media (max-width: 640px) {
		display: flex;
		justify-content: center;
	}

	&:focus {
		border: none;
	}
}

// .dp__month_year_wrap {
// 	width: auto;
// }

// .dp__month_year_row {
// 	height: 40px;
// 	margin-bottom: 16px;
// }

// .dp__calendar_header {
// 	width: 100%;
// }

// .dp__inner_nav svg {
// 	width: 24px;
// 	height: 24px;
// }

// .dp__month_year_col_nav {
// 	&:first-child {
// 		margin-right: auto;
// 	}

// 	&:last-child {
// 		margin-left: auto;
// 	}
// }

// .dp__month_year_select {
// 	width: auto;
// 	padding: 0 4px;
// }

.dp__calendar_header_item {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-grow: 0;

	width: 40px;
	height: 40px;

	font-family: 'Ambit';
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	line-height: 24px;

	color: #cbcdcd;

	@media (min-width: 640px) {
		width: 40px;
		height: 40px;
	}
}

.dp__active_date,
.dp__overlay_cell_active {
	color: #ffffff !important;
	&.dp__today {
		border-color: var(--dp-primary-color) !important;
	}
}
// // .dp__calendar_item:not(:last-child) {
// // 	margin-right: 6px;
// // }

// .dp__calendar_item {
// 	@media (min-width: 640px) {
// 		width: 40px;

// 		&:not(:last-child) {
// 			margin-right: 6px;
// 		}
// 	}
// }

.dp__today {
	border-color: #cbcdcd !important;
}

.dp__sidebar_right {
	padding: 0;
}

.dp__range_start,
.dp__range_between,
.dp__range_end {
	background: #ff5e46;
	color: #ffffff !important;
	border: 1px solid #ff5e46 !important;
	border-radius: 20px;
}

.dp__range_start {
	// width: 46px !important;
	border-top-right-radius: 0 !important;
	border-bottom-right-radius: 0 !important;
}

.dp__range_between {
	// width: 46px !important;
	border-radius: 0 !important;
}

.dp__range_end {
	// width: 46px !important;
	border-top-left-radius: 0 !important;
	border-bottom-left-radius: 0 !important;
}

.dp__range_start.dp__range_end {
	border-radius: 50% !important;
}

// .dp__range_start.dp__range_end {
// 	width: 40px !important;
// 	border-radius: 20px !important;
// }

// .dp__sidebar_right {
// 	@media (min-width: 640px) {
// 		margin: -12px 0 -12px 10px;
// 		padding: 12px 0;
// 		width: 164px;
// 	}
// 	@media (max-width: 640px) {
// 		margin: 0;
// 		padding: 0;
// 		display: flex;
// 		position: absolute;
// 		overflow: auto;
// 		width: 260px;
// 		font-size: 14px;
// 	}
// }
.dp__arrow_bottom,
.dp__calendar_header_separator {
	display: none;
}

// .dp__instance_calendar {
// 	@media (max-width: 640px) {
// 		padding-top: 36px;
// 		margin: 0 auto;
// 	}
// }

.dp__menu_content_wrapper {
	@media (max-width: 640px) {
		display: flex;
		flex-direction: column;
		width: 100%;
		justify-content: center;
		.dp__sidebar_right {
			border: 0;
		}
	}
}

// .dp__instance_calendar {
// 	@media (max-width: 640px) {
// 		width: 100%;
// 	}
// }

.dp__theme_light {
	--dp-background-color: #ffffff;
	--dp-text-color: #686d6d;
	--dp-hover-color: #f6f7f9;
	--dp-hover-text-color: #686d6d;
	--dp-primary-color: #ff5e46;
	--dp-primary-text-color: #686d6d;
	--dp-secondary-color: #dde0e0;
	--dp-border-color: #f6f7f9;
	--dp-menu-border-color: #f6f7f9;
	--dp-border-color-hover: #f6f7f9;
	--dp-disabled-color: #f6f7f9;
	--dp-scroll-bar-background: #f6f7f9;
	--dp-scroll-bar-color: #959595;
	--dp-success-color: #76d275;
	--dp-success-color-disabled: #a3d9b1;
	--dp-icon-color: #959595;
	--dp-danger-color: #ff6f60;
	--dp-highlight-color: rgba(25, 118, 210, 0.1);
}
</style>
