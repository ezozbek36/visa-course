import handlebars from '@vituum/vite-plugin-handlebars'
import htmlMinifier from 'vite-plugin-html-minifier'
import { defineConfig } from 'vite'
import vituum from 'vituum'

import fontSubsetPlugin from './scripts/vite-plugin-font-subset.js'

export default defineConfig(({ mode }) => ({
	appType: 'mpa',
	base: process.env.BASE_URL || '/',
	plugins: [
		...(mode === 'production' ? [vituum()] : []),
		handlebars({
			context: {
				base: process.env.BASE_URL || '/',
				isProd: mode === 'production',
			},
		}),
		htmlMinifier({
			minify: true,
		}),
		fontSubsetPlugin(),
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
