import { defineConfig } from 'vite'
import { resolve } from 'path'

const entries = {
	carousel: resolve(__dirname, 'src/js/modules/carousel.js'),
	countdown: resolve(__dirname, 'src/js/modules/countdown.js'),
	form: resolve(__dirname, 'src/js/modules/form.js'),
}

const entryName = process.env.ENTRY || Object.keys(entries)[0]

export default defineConfig({
	build: {
		emptyOutDir: false,
		copyPublicDir: false,
		outDir: 'dist/assets',
		lib: {
			entry: entries[entryName],
			formats: ['iife'],
			name: entryName.charAt(0).toUpperCase() + entryName.slice(1),
			fileName: () => `${entryName}.min.js`,
		},
	},
})
