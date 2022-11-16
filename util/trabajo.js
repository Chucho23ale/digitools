module.exports = (request, response, next) => {
    if (request.session.permisos.indexOf('trabajo') == -1) {
        return response.redirect('incidencias');
    }
    next();
}