<script lang="ls">
	let { selection = $bindable() } = $props();
</script>

<div class="m-4 flex w-full flex-col justify-around gap-2 md:flex-row">
	<button
		onclick={() => (selection = 'category')}
		class="btn-switch-2"
		class:active={selection === 'category'}
	>
		Add New Category
	</button>
	<button
		onclick={() => (selection = 'task')}
		class="btn-switch-2"
		class:active={selection === 'task'}
	>
		Add Tasks
	</button>
</div>
