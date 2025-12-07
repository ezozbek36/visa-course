import handlebars from '@vituum/vite-plugin-handlebars'
import htmlMinifier from 'vite-plugin-html-minifier'
import { defineConfig } from 'vite'
import vituum from 'vituum'

export default defineConfig(({ mode }) => ({
	appType: 'mpa',
	plugins: [
		...(mode === 'production' ? [vituum()] : []),
		handlebars(),
		htmlMinifier({
			minify: true,
		}),
	],
	build: {
		rollupOptions:
			mode === 'production'
				? {
						input: ['./index.hbs', './anketa.hbs'],
					}
				: undefined,
	},
}))
