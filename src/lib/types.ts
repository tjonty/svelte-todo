export interface Task{
    task: String
    status: Boolean
}

export type Todo = Record<string, Task>

export type Todos = Record<string, Todo>