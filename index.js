const express = require('express')
const app = express()

const { config } = require('./config/index')

const authApi = require('./routes/auth.js')
const moviesApi = require('./routes/movies.js')
const userMovieApi = require('./routes/userMovies.js')

//Middlewares
const { logErrors, wrapErrors, errorHandler } = require('./utils/middleware/errorHandlers')
const notFoundHandler = require('./utils/middleware/notFoundHandler')


// Body parse (Para intereprepeat los datos del json)
app.use(express.json())

// Routes
authApi(app)
moviesApi(app)
userMovieApi(app)

// Catch 404
app.use(notFoundHandler)

//Errores midlewares
app.use(logErrors)
app.use(wrapErrors)
app.use(errorHandler)

app.listen(config.port, ()=> {
  console.log(`Listening http://localhost:${config.port}`)
})

