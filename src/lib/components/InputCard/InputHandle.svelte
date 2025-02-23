<script lang="ts">
	import { analytics, db } from '$lib/firebase';

	import { currentUser } from '$lib/stores';
	import type { Category } from '$lib/types';
	import { logEvent } from 'firebase/analytics';
	import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
	import BtnSwitch from './BtnSwitch.svelte';
	import CategoryInput from './CategoryInput.svelte';
	import TaskInput from './TaskInput.svelte';

	let {
		category = $bindable(),
		taskName = $bindable(),
		userCategory,
		loadDocs,
		addTodo
	} = $props();

	let selection = $state('category');
	let newCategory = $state('');

	async function addCategory() {
		const uid = $currentUser?.uid;

		if (!uid || !newCategory) {
			console.error('Missing required fields: user ID, newCategory');
			return;
		}

		try {
			const todoRef = doc(db, 'todos', uid);
			const docSnap = await getDoc(todoRef);
			const currentCategories: Category = docSnap.exists() ? docSnap.data()?.category || [] : [];

			if (!currentCategories.includes(newCategory)) {
				await updateDoc(todoRef, {
					category: arrayUnion(newCategory)
				});
			}

			newCategory = '';
			await loadDocs();

			analytics &&
				logEvent(analytics, 'category_added', {
					page_title: 'Todo Page',
					page_location: window.location.href,
					page_path: window.location.pathname
				});
		} catch (err: any) {
			throw new Error('Unable to add category to db: ', err.stack);
		}
	}
</script>

<div class="m-2 flex flex-col items-center justify-evenly p-2 md:m-4 md:p-4">
	<hr class="w-full" />

	<BtnSwitch bind:selection />

	<div class="mt-4 flex w-full flex-col justify-evenly gap-3 md:flex-row">
		{#if selection == 'category'}
			<CategoryInput bind:newCategory {addCategory} />
		{:else}
			<TaskInput bind:category bind:taskName {userCategory} {addTodo} />
		{/if}
	</div>
</div>
