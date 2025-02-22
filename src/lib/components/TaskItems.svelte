<script lang="ts">
	let { handleStatusChange, id, key, value } = $props();
</script>

<button
	class={'my-4 flex w-full flex-row items-center justify-start rounded-2xl border-[1px] border-black bg-white p-3 shadow-md shadow-black transition duration-300 ease-in hover:shadow-2xl'}
	onclick={() => handleStatusChange(id, key)}
>
	<input type="checkbox" bind:checked={value.status} />
	<span class="mx-2">{value.task}</span>
</button>
