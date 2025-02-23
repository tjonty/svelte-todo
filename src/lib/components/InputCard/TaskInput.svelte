<script lang="ts">
	let { taskName = $bindable(), category = $bindable(), userCategory, addTodo } = $props();
</script>

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
