module.exports = {
	mode: "jit",
	purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			screens: {
				md: "768px", // add a new breakpoint for md prefix
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
