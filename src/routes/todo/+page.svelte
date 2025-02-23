<script lang="ts">
	import AuthCheck from '$lib/components/AuthCheck.svelte';
	import InputTask from '$lib/components/InputCard/InputHandle.svelte';
	import { analytics, db } from '$lib/firebase';
	import { currentUser } from '$lib/stores';
	import type { Category, Task, Todo, UserTodoStoreData } from '$lib/types';
	import { doc, getDoc, increment, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { logEvent } from 'firebase/analytics';
	import TaskCard from '$lib/components/TaskCard.svelte';
	import { get } from 'svelte/store';
	// import { addTodo, handleStatusChange, loadDocs } from '$lib/services/todoServices';

	let category: string = $state('');
	let taskId: number = $state(Date.now());
	let taskName: string = $state('');
	let usersToDo: Todo = $state({});
	let userCategory: Category = $state([]);

	// fetch the data of a user from db when page load
	$effect(() => {
		loadDocs();
	});

	// function to fetch user's todo lists
	async function loadDocs() {
		const uid = $currentUser?.uid;

		if (!uid) {
			console.error('No user is signed');
			return { userCategory: [], userToDo: {} };
		}

		const todoRef = doc(db, 'todos', uid);

		const docs = await getDoc(todoRef);

		if (!docs.exists()) {
			userCategory = [];
			usersToDo = {};
			return;
		}

		const data: UserTodoStoreData = docs.data();

		usersToDo = data?.tasks || {};
		userCategory = data?.category || [];
	}

	// function to add todos to db
	async function addTodo() {
		const uid = get(currentUser)?.uid;

		if (!uid || !category || !taskId || !taskName) {
			console.error('Missing required fields: user Id, category, taskId or taskName.');
			return;
		}

		try {
			const todoRef = doc(db, 'todos', uid);
			const taskData: Task = {
				task: taskName,
				status: false,
				createdAt: Date.now()
			};

			const docSnap = await getDoc(todoRef);
			if (docSnap.exists()) {
				const existingTasks: Task = docSnap.data().tasks?.[category] || {};

				const taskExists: boolean = Object.values(existingTasks).some(
					(task: any) => task.task === taskName
				);

				if (taskExists) {
					taskName = '';
					return;
				}
			}

			await setDoc(
				todoRef,
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
			await loadDocs();

			analytics &&
				logEvent(analytics, 'task_added', {
					page_title: 'Todo Page',
					page_location: window.location.href,
					page_path: window.location.pathname
				});
		} catch (err: any) {
			throw new Error('Unable to add record to db: ', err.stack);
		}
	}

	// function to change status of a task
	async function handleStatusChange(taskId: number, category: string) {
		const uid = get(currentUser)?.uid;
		if (!uid || !category || !taskId) {
			console.error('Missing required fields: user ID, category or taskID');
			return;
		}

		try {
			const todoRef = doc(db, 'todos', uid);
			const statusPath = `tasks.${category}.${taskId}.status`;
			const docSnap = await getDoc(todoRef);

			if (!docSnap.exists()) {
				console.warn('Todo document does not exist for user:', uid);
				return;
			}

			const data: UserTodoStoreData = docSnap.data();
			const currentStatus = data?.tasks?.[category]?.[taskId]?.status;

			if (typeof currentStatus !== 'boolean') {
				console.warn('Task not found at path: ', statusPath);
				return;
			}

			await updateDoc(todoRef, {
				[statusPath]: !currentStatus,
				'metadata.lastUpdated': serverTimestamp()
			});

			await loadDocs();

			analytics &&
				logEvent(analytics, 'task_status_changed', {
					page_title: 'Todo Page',
					page_location: window.location.href,
					page_path: window.location.pathname
				});
		} catch (err: any) {
			throw new Error('Unable to update record in db: ', err.stack);
		}
	}

	onMount(() => {
		analytics &&
			logEvent(analytics, 'page_view', {
				page_title: 'Todo Page',
				page_location: window.location.href,
				page_path: window.location.pathname
			});
	});
</script>

<div>
	<AuthCheck>
		<p class="text-2xl">ONE STEP AT A TIME</p>

		<InputTask bind:category bind:taskName {userCategory} {loadDocs} {addTodo} />

		<TaskCard {userCategory} {usersToDo} {handleStatusChange} />
	</AuthCheck>
</div>
