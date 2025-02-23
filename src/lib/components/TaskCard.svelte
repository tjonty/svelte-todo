<script lang="ts">
	import TaskItems from './TaskItems.svelte';

	let { userCategory, usersToDo, handleStatusChange } = $props();
</script>

<div class="m-4 grid grid-cols-1 gap-4 md:grid-cols-3">
	{#each userCategory as category}
		<div
			class="group rounded-3xl bg-[#D6E6F2] p-4 transition duration-300 ease-in hover:bg-[#769FCD]"
		>
			<div
				class="category-title w-full bg-[#769FCD] transition duration-300 ease-out group-hover:bg-[#D6E6F2]"
			>
				{category}
			</div>
			<TaskItems {category} {usersToDo} {handleStatusChange} />
		</div>
	{/each}
</div>
