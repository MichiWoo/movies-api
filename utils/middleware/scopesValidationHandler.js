//los Scopes nos ayudan a validar que los permisos sean los correctos
const boom = require('@hapi/boom')

// esta funcion recibira los scopes permitidos para las rutas
// pero lo que va ha devolver la función es un middleware
function scopesValidationHandler(allowedScopes) {
  return function(req, res, next) {
    if (!req.user || (req.user && !req.user.scopes)) {
      next(boom.unauthorized('Missing scopes'))
    }

    // si existe el usuario y tiene scopes, vamos a verificar si tienen acceso
    const hasAccess = allowedScopes
      .map(allowedScope => req.user.scopes.includes(allowedScope))
      .find(allowed => Boolean(allowed))

    if (hasAccess) {
      //pasamos al siguiente middleware
      next()
    } else {
      next(boom.unauthorized('Insufficient scopes'))
    }
  }
}

module.exports = scopesValidationHandler