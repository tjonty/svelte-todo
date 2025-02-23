import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'public',  // Output folder for HTML files
			assets: 'public', // Output folder for JS, CSS, etc.
			fallback: 'index.html' // For client-side routing (SPA behavior)
		  })
	}
};

export default config;
