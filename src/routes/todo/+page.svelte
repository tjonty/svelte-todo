<script lang="ts">
	import AuthCheck from '$lib/components/AuthCheck.svelte';
	import TaskItems from '$lib/components/TaskItems.svelte';
	import InputTask from '$lib/components/InputTask.svelte';
	import { db } from '$lib/firebase';
	import { currentUser } from '$lib/stores';
	import type { Todo } from '$lib/types';
	import {
		doc,
		getDoc,
		increment,
		serverTimestamp,
		setDoc,
		updateDoc,
		writeBatch
	} from 'firebase/firestore';

	let category: string = $state('');
	let taskId: number = $state(Date.now());
	let taskName: string = $state('');
	let sortedCategories: string[] = $state([]);
	let usersToDo: any = $state({});
	let userCategory: any = $state([]);

	// fetch the data of a user from db when page load
	$effect(() => {
		loadDocs();
	});

	$effect(() => {
		console.log('category: ', category);
	});

	$inspect(category);

	// function to fetch user's todo lists
	async function loadDocs() {
		if ($currentUser?.uid) {
			const tofoRef = doc(db, 'todos', $currentUser.uid);

			const docs = await getDoc(tofoRef);

			if (!docs.exists()) {
				userCategory = [];
				usersToDo = {};
				return;
			}

			const data = docs.data();

			usersToDo = data?.tasks || {};
			userCategory = data?.category || [];

			const exists = docs.exists();

			if (!exists) {
				throw new Error('Data does not exists!');
			}
		} else {
			console.error('No user is logged in.');
		}
	}

	// function to add todos to db
	async function addTodo() {
		if ($currentUser?.uid && category && taskId) {
			try {
				const tofoRef = doc(db, 'todos', $currentUser.uid);
				const taskData = {
					task: taskName,
					status: false,
					createdAt: Date.now()
				};

				const docSnap = await getDoc(tofoRef);

				if (docSnap.exists()) {
					// Get existing tasks
					const existingTasks = docSnap.data().tasks?.[category] || {};

					// Check if task already exists
					const taskExists = Object.values(existingTasks).some(
						(task: any) => task.task === taskName
					);

					if (taskExists) return;
				}

				// Update document (creates if doesn't exist)
				await setDoc(
					tofoRef,
					{
						tasks: {
							[`${category}`]: {
								[`${taskId}`]: taskData
							}
						},
						'metadata.taskCount': increment(1)
					},
					{ merge: true }
				);
				taskName = '';
				taskId = Date.now();
				await loadDocs(); // to reload user's todo list
			} catch (err: any) {
				throw new Error('Unable to add record to db: ', err.stack);
			}
		} else {
			console.error('Missing required fields: user ID, category or taskID');
		}
	}

	// function to change status of a task
	async function handleStatusChange(taskId: number, category: string) {
		if ($currentUser?.uid && category && taskId) {
			try {
				const tofoRef = doc(db, 'todos', $currentUser.uid);

				const statusPath = `tasks.${category}.${taskId}.status`;

				const docSnap = await getDoc(tofoRef);

				if (!docSnap.exists()) {
					console.warn('Todo document does not exist for user:', $currentUser.uid);
					return;
				}

				const data = docSnap.data();
				const currentStatus = data?.tasks?.[category]?.[taskId]?.status;

				if (typeof currentStatus !== 'boolean') {
					console.warn('Task not found at path: ', statusPath);
				}

				await updateDoc(tofoRef, {
					[statusPath]: !currentStatus,
					'metadata.lastUpdated': serverTimestamp()
				});

				await loadDocs(); // to reload user's todo list
			} catch (err: any) {
				throw new Error('Unable to update record in db: ', err.stack);
			}
		} else {
			console.error('Missing required fields: user ID, category or taskID');
		}
	}
</script>

<div>
	<AuthCheck>
		<p class="text-2xl">ONE STEP AT A TIME</p>

		<InputTask
			{loadDocs}
			bind:sortedCategories
			{userCategory}
			{addTodo}
			bind:category
			bind:taskName
		/>

		<div class="m-4 grid grid-cols-1 gap-4 md:grid-cols-3">
			{#if Object.entries(usersToDo).length > 0}
				{#each Object.entries(usersToDo) as [key, category]}
					<div
						class="group rounded-3xl bg-[#D6E6F2] p-4 transition duration-300 ease-in hover:bg-[#769FCD]"
					>
						<div
							class="category-title w-full bg-[#769FCD] transition duration-300 ease-out group-hover:bg-[#D6E6F2]"
						>
							{key}
						</div>
						{#if category && Object.entries(category).length > 0}
							{#each Object.entries(category).sort(([_, a], [__, b]) => Number(a.status) - Number(b.status)) as [id, value]}
								<TaskItems {id} {key} {value} {handleStatusChange} />
							{/each}
						{/if}
					</div>
				{/each}
			{:else if userCategory.length > 0}
				{#each userCategory as category}
					<div
						class="group rounded-3xl bg-[#D6E6F2] p-4 transition duration-300 ease-in hover:bg-[#769FCD]"
					>
						<div
							class="category-title w-full bg-[#769FCD] transition duration-300 ease-out group-hover:bg-[#D6E6F2]"
						>
							{category}
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</AuthCheck>
</div>
