<script lang="ts">
	import AuthCheck from '$lib/components/AuthCheck.svelte';
	import TaskItems from '$lib/components/TaskItems.svelte';
	import InputTask from '$lib/components/InputTask.svelte';
	import { db } from '$lib/firebase';
	import { currentUser } from '$lib/stores';
	import type { Todo } from '$lib/types';
	import { doc, getDoc, updateDoc, writeBatch } from 'firebase/firestore';

	let category: string = $state('');
	let taskId: number = $state(1);
	let taskName: string = $state('');
	let sortedCategories: string[] = $state([]);
	let usersToDo: any = $state({});

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
			const userRef = doc(db, 'todos', $currentUser.uid);

			const docs = await getDoc(userRef);
			const exists = docs.exists();

			if (!exists) {
				throw new Error('Data does not exists!');
			}

			const data = docs.data();

			sortedCategories = Object.keys(data).sort();

			const ordered = sortedCategories.reduce((obj: any, key) => {
				obj[key] = data[key];
				return obj;
			}, {});

			usersToDo = ordered;
		} else {
			console.error('No user is logged in.');
		}
	}

	// function to add todos to db
	async function addTodo() {
		if ($currentUser?.uid && category && taskId) {
			try {
				const userRef = doc(db, 'todos', $currentUser.uid);

				const record: Todo = {
					[`${category}.${taskId}`]: {
						task: taskName,
						status: false
					}
				};

				if (usersToDo == null) {
					// for new entry
					const batch = writeBatch(db);
					batch.set(userRef, record);

					await batch.commit();
				} else {
					// for existing entries
					await updateDoc(userRef, record);
				}
				taskId++;
				loadDocs(); // to reload user's todo list
			} catch (err: any) {
				throw new Error('Unable to add record to db: ', err.stack);
			}
		} else {
			console.error('No user is logged in.');
		}
	}

	// function to change status of a task
	async function handleStatusChange(taskId: string, category: string) {
		if ($currentUser?.uid && category && taskId) {
			try {
				const userRef = doc(db, 'todos', $currentUser.uid);

				const docSnap = await getDoc(userRef);

				if (docSnap.exists()) {
					const data = docSnap.data();

					const currentStatus = data[category]?.[taskId]?.status;

					const record = {
						[`${category}.${taskId}.status`]: !currentStatus
					};

					await updateDoc(userRef, record);
				}
			} catch (err: any) {
				throw new Error('Unable to update record in db: ', err.stack);
			}
		}
		loadDocs(); // to reload user's todo list
	}
</script>

<div>
	<AuthCheck>
		<p class="text-2xl">ONE STEP AT A TIME</p>

		<InputTask bind:sortedCategories {addTodo} bind:category bind:taskName />

		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
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
		</div>
	</AuthCheck>
</div>
