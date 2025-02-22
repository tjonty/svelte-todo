<script lang="ts">
	import { currentUser } from '$lib/stores';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from '../../routes/$types';

	let { children }: { children: Snippet } = $props();
</script>

{#if $currentUser}
	{@render children()}
{:else}
	<p>You must be loged in to access this page!!</p>
{/if}
