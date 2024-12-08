import { defineConfig } from 'vite';
import { version } from './package.json';

function monkeyConfig(version: string): string {
	return `// ==UserScript==
// @name        Path Of Exile Trade Aggregator
// @namespace   Violentmonkey Scripts
// @match       https://www.pathofexile.com/trade*
// @grant       none
// @version     ${version}
// @author      CerikNguyen
// @license MIT
// @description Aggregates the number of listings per account name and displays a whisper button for each account name in the Path Of Exile trade site.
// @downloadURL none
// ==/UserScript==\n\n`;
}

export default defineConfig({
	plugins: [
		{
			name: 'prepend-monkey-config',
			generateBundle(_, bundle) {
				for (const filename in bundle) {
					const entry = bundle[filename];
					if (entry.type === 'chunk') {
						entry.code = monkeyConfig(version) + entry.code;
					}
				}
			},
		},
	],
	build: {
		outDir: 'dist-monkey',
		rollupOptions: {
			output: {
				format: 'iife',
			},
		},
	},
});
