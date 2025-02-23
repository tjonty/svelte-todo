<script lang="ts">
	let { newCategory = $bindable(), addCategory } = $props();
</script>

<input
	type="text"
	name="task"
	class="input w-full md:w-1/3"
	placeholder="add new category"
	bind:value={newCategory}
/>
<button onclick={addCategory} class="btn-add m!w-full md:!w-1/4"> Add Category </button>
