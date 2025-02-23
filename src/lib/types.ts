export type Category = string[]
export interface Task {
    task: string
    status: boolean
    createdAt: number
}

export type SortedTask = { taskId: number; task: Task }[]

export type TasksById = Record<number, Task> 

export type Todo = Record<string, TasksById>

export interface UserTodoStoreData {
    category?: Category
    tasks?: Todo
}