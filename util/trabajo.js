module.exports = (request, response, next) => {
    if (request.session.permisos.indexOf('agregatrabajo') == -1) {
        return response.redirect('incidencias');
    }
    next();
}