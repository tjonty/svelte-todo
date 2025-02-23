<script lang="ts">
	import type { SortedTask, Task, Todo } from '$lib/types';

	let { category, usersToDo, handleStatusChange } = $props<{
		category: string;
		usersToDo: Todo;
		handleStatusChange: (taskId: number, category: string) => void;
	}>();

	function getSortedTasks(todo: Todo, cat: string): SortedTask {
		return Object.entries(todo?.[cat] ?? {})
			.map(([taskId, task]) => ({ taskId: Number(taskId), task }))
			.sort((a, b) => {
				const statusDiff = Number(a.task.status) - Number(b.task.status);
				return statusDiff !== 0 ? statusDiff : a.taskId - b.taskId;
			});
	}
</script>

{#each getSortedTasks(usersToDo, category) as { taskId, task }}
	<button
		class="my-4 flex w-full flex-row items-center justify-start rounded-2xl border-[1px] border-black bg-white p-3 shadow-md shadow-black transition duration-300 ease-in hover:shadow-2xl"
		class:bg-gray-200={task.status}
		onclick={() => handleStatusChange(taskId, category)}
	>
		<input type="checkbox" bind:checked={task.status} />
		<span class="mx-2">{task.task}</span>
	</button>
{/each}

<!-- {#each Object.entries((usersToDo as Todo)?.[category] ?? {}) as [taskId, task]}
	{#if !task.status}
		<button
			class={'my-4 flex w-full flex-row items-center justify-start rounded-2xl border-[1px] border-black bg-white p-3 shadow-md shadow-black transition duration-300 ease-in hover:shadow-2xl'}
			onclick={() => handleStatusChange(taskId, category)}
		>
			<input type="checkbox" bind:checked={task.status} />
			<span class="mx-2">{task.task}</span>
		</button>
	{/if}
{/each}

{#each Object.entries((usersToDo as Todo)?.[category] ?? {}) as [taskId, task]}
	{#if task.status}
		<button
			class={'my-4 flex w-full flex-row items-center justify-start rounded-2xl border-[1px] border-black bg-white p-3 shadow-md shadow-black transition duration-300 ease-in hover:shadow-2xl'}
			onclick={() => handleStatusChange(taskId, category)}
		>
			<input type="checkbox" bind:checked={task.status} />
			<span class="mx-2">{task.task}</span>
		</button>
	{/if}
{/each} -->
