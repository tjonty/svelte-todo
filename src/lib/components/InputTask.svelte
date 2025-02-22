<script lang="ts">
	let {
		sortedCategories = $bindable(),
		category = $bindable(),
		taskName = $bindable(),
		addTodo
	} = $props();
	let selection = $state('category');
	let newCategory = $state('');

	function addCategory() {
		sortedCategories = [...sortedCategories, newCategory].sort();
	}
	$inspect(newCategory);
</script>

<div class="m-2 flex flex-col items-center justify-evenly p-2 md:m-4 md:p-4">
	<div class="mb-4 flex w-full flex-row justify-around">
		<button onclick={() => (selection = 'category')} class="btn-switch-2">
			Add New Category
		</button>
		<button onclick={() => (selection = 'task')} class="btn-switch-2"> Add Tasks </button>
	</div>

	<hr class="w-full" />

	<div class="mt-4 flex w-full flex-col justify-evenly md:flex-row">
		{#if selection == 'category'}
			<input
				type="text"
				name="task"
				class="input w-1/2"
				placeholder="add new category"
				bind:value={newCategory}
			/>
			<button onclick={() => addCategory()} class="btn-add !w-1/4"> Add Category </button>
		{:else}
			<select class="input w-1/4" bind:value={category}>
				<option value="" disabled selected>select your category</option>
				{#each sortedCategories as cat}
					<option value={cat}>{cat}</option>
				{/each}
			</select>
			<input
				type="text"
				name="task"
				class="input w-1/4"
				placeholder="start tracking..."
				bind:value={taskName}
			/>
			<button onclick={addTodo} class="btn-add !w-1/4"> Add Task </button>
		{/if}
	</div>
</div>
