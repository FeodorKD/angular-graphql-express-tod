export interface Todo {
    id: string,
    name: string,
    description: string
}



export interface IAddTodoData {
    addTodo : Todo
}
export interface IDeleteTodoData {
    deleteTodo: Todo
}
export interface IGetTodoData {
    todos: Todo[]
}

