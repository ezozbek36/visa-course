import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

/**
 * Vite plugin to subset fonts
 * @returns {import('vite').Plugin}
 */
export default function fontSubsetPlugin() {
	const virtualUrlPattern = /url\(['"]?virtual:subset-font\/([^'"\)]+)['"]?\)/g

	let config

	const getReplacement = async (fontName, isProd) => {
		if (isProd) {
			try {
				const scriptPath = path.resolve(config.root, 'scripts/subset_font.py')

				const command = `python3 ${scriptPath} --font ${fontName}`

				const { stdout } = await execAsync(command)

				const base64Font = stdout.trim()

				return `url('data:font/woff2;base64,${base64Font}')`
			} catch (error) {
				console.error(`[font-subset] Error subsetting font ${fontName}:`, error)
				throw error
			}
		} else {
			const baseUrl = config.base.endsWith('/') ? config.base : config.base + '/'
			return `url('${baseUrl}fonts/subset-${fontName}.woff2')`
		}
	}

	const replaceUrls = async (code, isProd) => {
		const replacements = []
		let match

		while ((match = virtualUrlPattern.exec(code)) !== null) {
			replacements.push({
				fullMatch: match[0],
				fontName: match[1],
				index: match.index,
			})
		}

		virtualUrlPattern.lastIndex = 0

		if (replacements.length === 0) return null

		const uniqueFonts = [...new Set(replacements.map(r => r.fontName))]
		const fontMap = {}

		for (const font of uniqueFonts) {
			fontMap[font] = await getReplacement(font, isProd)
		}

		return code.replace(virtualUrlPattern, (match, fontName) => {
			return fontMap[fontName]
		})
	}

	return {
		enforce: 'pre',
		name: 'vite-plugin-font-subset',
		configResolved(resolvedConfig) {
			config = resolvedConfig
		},
		async transform(code, id) {
			if (/\.(css|scss|sass|less|styl|js|ts|vue|hbs|html)$/.test(id)) {
				const isProd = config.command === 'build'
				const newCode = await replaceUrls(code, isProd)

				if (newCode) {
					return {
						code: newCode,
						map: null,
					}
				}
			}
		},
	}
}
