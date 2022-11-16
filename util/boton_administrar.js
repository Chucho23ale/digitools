module.exports = (request, response, next) => {
    if (request.session.permisos.indexOf('boton_administrar') == -1) {
        return response.redirect('/incidencias');
    }
    next();
}