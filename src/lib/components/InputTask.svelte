<script lang="ts">
	import { db } from '$lib/firebase';

	import { currentUser } from '$lib/stores';
	import { arrayUnion, doc, getDoc, setDoc, updateDoc, writeBatch } from 'firebase/firestore';

	let {
		sortedCategories = $bindable(),
		category = $bindable(),
		taskName = $bindable(),
		addTodo,
		userCategory,
		loadDocs
	} = $props();
	let selection = $state('category');
	let newCategory = $state('');

	async function addCategory() {
		if ($currentUser?.uid && newCategory) {
			try {
				const userRef = doc(db, 'todos', $currentUser.uid);

				if (userCategory.length == 0) {
					// for new entry
					await setDoc(
						userRef,
						{
							category: [newCategory]
						},
						{ merge: true }
					);
				} else {
					// for existing entries

					if (!userCategory.includes(category)) {
						await updateDoc(userRef, {
							category: arrayUnion(newCategory)
						});
					}
				}
				loadDocs();
			} catch (err: any) {
				throw new Error('Unable to add record to db: ', err.stack);
			}
		} else {
			console.error('No user is logged in.');
		}
	}
</script>

<div class="m-2 flex flex-col items-center justify-evenly p-2 md:m-4 md:p-4">
	<div class="mb-4 flex w-full flex-col justify-around gap-2 md:flex-row">
		<button onclick={() => (selection = 'category')} class="btn-switch-2">
			Add New Category
		</button>
		<button onclick={() => (selection = 'task')} class="btn-switch-2"> Add Tasks </button>
	</div>

	<hr class="w-full" />

	<div class="mt-4 flex w-full flex-col justify-evenly gap-3 md:flex-row">
		{#if selection == 'category'}
			<input
				type="text"
				name="task"
				class="input w-full md:w-1/3"
				placeholder="add new category"
				bind:value={newCategory}
			/>
			<button onclick={() => addCategory()} class="btn-add m!w-full md:!w-1/4">
				Add Category
			</button>
		{:else}
			<select class="input w-full md:w-1/4" bind:value={category}>
				<option value="" disabled selected>select your category</option>
				{#each userCategory as cat}
					<option value={cat}>{cat}</option>
				{/each}
			</select>
			<input
				type="text"
				name="task"
				class="input w-full md:w-1/3"
				placeholder="start tracking..."
				bind:value={taskName}
			/>
			<button onclick={addTodo} class="btn-add m!w-full md:!w-1/4"> Add Task </button>
		{/if}
	</div>
</div>
