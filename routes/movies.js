const express = require('express')
const MoviesServices = require('../services/movies')

const { movieIdSchema, createMovieSchema, updateMovieSchema } = require('../utils/schemas/movies')
const validationHandler = require('../utils/middleware/validationHandler')

//Cache
const cacheResponse = require('../utils/cacheResponse')
const { FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS } = require('../utils/time')

function moviesApi(app) {
  const router = express.Router()
  app.use('/api/movies', router)

  const movieServices = new MoviesServices()

  router.get('/', async function (req, res, next) {
    cacheResponse(res, FIVE_MINUTES_IN_SECONDS)
    const { tags } = req.query
    try {
      const movies = await movieServices.getMovies({ tags })
        res.status(200).json({
          data: movies,
          message: 'Movies listed'
        })
    } catch (err) {
      next(err)
    }
  })

  router.get('/:movieId', validationHandler({ movieId: movieIdSchema }, 'params'), async function (req, res, next) {
    cacheResponse(res, SIXTY_MINUTES_IN_SECONDS)
    const { movieId } = req.params
    try {
      const movie = await movieServices.getMovie({ movieId })
        res.status(200).json({
          data: movie,
          message: 'Movie retrieved'
        })
    } catch (err) {
      next(err)
    }
  })

  router.post('/', validationHandler(createMovieSchema), async function (req, res, next) {
    const { body: movie } = req
    try {
      const createdMovieId = await movieServices.createMovie({ movie })
        res.status(201).json({
          data: createdMovieId,
          message: 'Movie created'
        })
    } catch (err) {
      next(err)
    }
  })

  router.put('/:movieId', validationHandler({ movieId: movieIdSchema }, 'params'), validationHandler(updateMovieSchema), async function (req, res, next) {
    const { movieId } = req.params
    const { body: movie } = req
    try {
      const updatedMovieId = await movieServices.updateMovie({ movieId, movie })
        res.status(200).json({
          data: updatedMovieId,
          message: 'Movie updated'
        })
    } catch (err) {
      next(err)
    }
  })

  router.delete('/:movieId', validationHandler({ movieId: movieIdSchema }, 'params'), async function (req, res, next) {
    const { movieId } = req.params
    try {
      const deletedMovieId = await movieServices.deleteMovie({ movieId })
        res.status(200).json({
          data: deletedMovieId,
          message: 'Movie deleted'
        })
    } catch (err) {
      next(err)
    }
  })
}

module.exports = moviesApi
