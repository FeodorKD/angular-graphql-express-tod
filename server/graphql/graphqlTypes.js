const { GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLSchema} = require('graphql');
const Todo = require('../database/todoModel')

const TodoType = new GraphQLObjectType({
    name: 'Todo',
    description: 'This is a todo',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'root query',
    fields: () => ({
        todos: {
            type: new GraphQLList(TodoType),
            description: 'List of All Todos',
            resolve: () => {
                return  Todo.find({}).then(todos => todos).catch(err => err.message)
            }
        },
        todo:{
            type: TodoType,
            description: 'Single Todo',
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString)
                },
            },
            resolve: (root, args) => {
                return Todo.findById(args.id)
                    .then(todo => todo)
                    .catch(err => err.message)
            }
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'root mutation',
    fields: () => ({
        addTodo : {
            type: TodoType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                description: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: (root, args) => {
                const newTodo = new Todo({
                    id: String(Date.now()),
                    name: args.name,
                    description: args.description
                })
                return Todo.create(newTodo)
                    .then(todo => todo)
                    .catch(err => err)

            }
        },
        deleteTodo : {
            type: TodoType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString)
                },


            },
            resolve: (root, args) => {
                return Todo.deleteOne({id: args.id})
                    .then(result => {
                        if(result){
                            return result
                        }
                        return {}
                    })
                    .catch(err => {
                        console.log(err)
                        return err
                    })

            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

module.exports = schema