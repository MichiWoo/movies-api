const express = require('express')

const userMoviesServices = require('../services/userMovies')
const validationHandler = require('../utils/middleware/validationHandler')

const { movieIdSchema } = require('../utils/schemas/movies')
const { userIdSchema } = require('../utils/schemas/users')
const { createUserMovieShema } = require('../utils/schemas/userMovies')

function userMoviesApi(app) {
  const router = express.Router()
  app.use('/api/user-movies', router)

  const userMoviesService = new userMoviesServices

  router.get('/', validationHandler({ userId: userIdSchema }, 'query' ), async function(req, res, next) {
    const { userId } = req.query
    try {
      const userMovies = await userMoviesService.getUserMovies({ userId })

      res.status(200).json({
        data: userMovies,
        message: 'Movies listed'
      })
    } catch (error) {
      next(error)
    }
  })

  router.post('/', validationHandler(createUserMovieShema), async function(req, res, next){
    const { body: userMovie } = req

    try {
      const createdUserMovieId = await userMoviesService.createUserMovie({ userMovie })
      res.status(201).json({
        data: createdUserMovieId,
        message: 'user movie created'
      })
      
    } catch (error) {
      next(error)
    }
  })

  router.delete('/', validationHandler({ userMovieId: movieIdSchema}, 'params'), async function(req, res, next) {
    const { userMovieId } = req.params

    try {
      const deleteUserMovieId = await userMoviesService.deleteUserMovie( { userMovieId })
      
      res.status(200).json({
        data: deleteUserMovieId,
        message: 'User Movie Id eliminada'
      })
    } catch (error) {
      next(error)
    }
  })

}

module.exports = userMoviesApi
