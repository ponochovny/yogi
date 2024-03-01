/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: [],
	theme: {
		screens: {
			xs: '320px',
			sm: '614px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
		},
		extend: {
			colors: {
				// colors here
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
}
