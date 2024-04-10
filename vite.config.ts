import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import { version } from './package.json';

export default defineConfig({
	plugins: [
		crx({
			manifest: {
				name: 'Trade Aggregator',
				version,
				manifest_version: 3,
				content_scripts: [
					{
						js: [
							'src/content-scripts/main.ts',
							'node_modules/@webcomponents/custom-elements/custom-elements.min.js',
						],
						matches: ['https://*.pathofexile.com/*'],
					},
				],
			},
		}),
	],
});