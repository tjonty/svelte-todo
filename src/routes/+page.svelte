<script lang="ts">
	import { analytics, auth } from '$lib/firebase';

	import { currentUser } from '$lib/stores';
	import { logEvent } from 'firebase/analytics';
	import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
	import { onMount } from 'svelte';

	async function signInWithGoogle() {
		const provider = new GoogleAuthProvider();
		const user = await signInWithPopup(auth, provider);
		console.log(user);
	}

	onMount(() => {
		analytics &&
			logEvent(analytics, 'page_view', {
				page_title: 'Home Page',
				page_location: window.location.href,
				page_path: window.location.pathname
			});
	});
</script>

<div class="flex flex-col items-center">
	{#if $currentUser}
		<p class="text-2xl">Welcome, {$currentUser.displayName}</p>
		<button on:click={() => signOut(auth)} class="btn-add !m-4">Sign out</button>
	{:else}
		<button on:click={signInWithGoogle} class="btn-add !m-4">Sign in with Google</button>
	{/if}
</div>
