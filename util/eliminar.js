module.exports = (request, response, next) => {
    if (request.session.permisos.indexOf('eliminar') == -1) {
        return response.redirect('/incidencias');
    }
    next();
}