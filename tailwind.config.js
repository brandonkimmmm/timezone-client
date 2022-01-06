module.exports = {
	purge: {
		content: ["./src/**/*.svelte"],
		enabled: !process.env.ROLLUP_WATCH
	},
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
	},
	variants: {
		extend: {},
	},
	plugins: [],
	future: {
		purgeLayersByDefault: true,
		removeDeprecatedGapUtilities: true
	}
}
