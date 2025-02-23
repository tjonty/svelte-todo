<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import '../app.css';
	import { currentUser } from '$lib/stores';
	import { afterNavigate } from '$app/navigation';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	let currentPath = $state('');

	afterNavigate((navigation) => {
		currentPath = navigation.to?.url.pathname as string;
	});
</script>

<nav
	class="flex w-full flex-row items-center justify-evenly border-b-2 border-amber-700 p-4 text-center"
>
	<a href="/todo" class="btn-switch-1" class:active={currentPath === '/todo'}>Todo</a>
	<a href="/" class="btn-switch-1" class:active={currentPath === '/'}>
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
