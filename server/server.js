const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const {graphqlHTTP} = require('express-graphql')
const schema = require('./graphql/graphqlTypes')
require('dotenv').config()

const app = express()

app.use(cors())
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))



async function startApp() {
    try {
        await mongoose.connect(process.env.DB_URL, {useUnifiedTopology: true, useNewUrlParser: true})
        app.listen( process.env.PORT , () => {
            console.log(`app listening port ${process.env.PORT}`)
        })
    } catch (err) {
        console.log(err)
    }
}

startApp()