const express = require('express')
const app = express()

const { config } = require('./config/index')
const { moviesApi } = require('./routes/movies.js')

//Middlewares
const { logErrors, errorHandler } = require('./utils/middleware/errorHandlers')

// Body parse (Para intereprepeat los datos del json)
app.use(express.json())

moviesApi(app)

app.use(logErrors)
app.use(errorHandler)

app.listen(config.port, ()=> {
  console.log(`Listening http://localhost:${config.port}`)
})

