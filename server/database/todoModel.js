const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
    id: String,
    name: String,
    description: String
})

const Todo = mongoose.model('Todos', TodoSchema)

module.exports = Todo