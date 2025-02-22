<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import '../app.css';
	import Page from './+page.svelte';
	import { currentUser } from '$lib/stores';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<nav
	class="flex w-full flex-col items-center justify-evenly border-b-2 border-amber-700 p-4 text-center md:flex-row"
>
	<a class="btn-switch-1" href="/todo">Todo</a>
	<a href="/" class="btn-switch-1">
		{#if $currentUser}
			Sign Out
		{:else}
			Sign In
		{/if}
	</a>
</nav>

<div class="mx-auto w-4/6 items-center text-center">
	{@render children()}
</div>

<style>
	@reference "tailwindcss/theme";
</style>
