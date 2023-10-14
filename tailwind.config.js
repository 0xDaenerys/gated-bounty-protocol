/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./src/**/**/*.{js,ts,jsx,tsx}"],
	theme: {
		minHeight: {
			'1/2': '50%',
			'3/4': '75%',
		},
		extend: {
			colors: {
				colorPrimaryLight: "var(--colorPrimaryLight)",
				colorSecondaryLight: "var(--colorSecondaryLight)",
				colorPrimaryDark: "var(--colorPrimaryDark)",
				colorSecondaryDark: "var(--colorSecondaryDark)",
			},
		},
	},
}

