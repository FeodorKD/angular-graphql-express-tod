import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import {IAddTodoData,  IDeleteTodoData, IGetTodoData, Todo} from "../todo";
import {ADD_TODO, DELETE_TODO, GET_TODOS} from "../graphql.queries";

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit{
    todos: Todo[] = []
    error: any

    todoForm = new FormGroup({
        name: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required)
    });

    addTodo() {
        this.apollo.mutate<IAddTodoData>({
            mutation: ADD_TODO,
            variables: {
                name: this.todoForm.value.name,
                description: this.todoForm.value.description
            },
            refetchQueries: [{
                query: GET_TODOS
            }],
        }).subscribe(({data}) => {
            if(data){
                const {id, name, description} = data.addTodo
                this.todos.push({id, name, description})
            }
            this.todoForm.reset()
        }, error => {
            this.error = error;

        })
    }

    deleteTodo(id: string) {
        // apollo graphql query to delete todo
        this.apollo.mutate<IDeleteTodoData>({
            mutation: DELETE_TODO,
            variables: {
                id: id,
            },
            refetchQueries: [{
                query: GET_TODOS
            }]
        }).subscribe(({data}) => {
                if(data){

                    console.log(data)
                } else {
                    this.todos.filter((todo) => {
                        return todo.id != id
                    })
                }
            }
            , (error) => {
                this.error = error;

            }
        );
    }
    constructor(private apollo: Apollo) {
    }

    ngOnInit(): void {
        this.apollo.watchQuery<IGetTodoData>({
            query: GET_TODOS
        }).valueChanges.subscribe(({ data, error }) => {
                if (data) {
                    this.todos = data.todos
                }
                this.error = error;

            }
        );
    }
}
