const Usuario = require("../models/usuario.model");
const bcrypt = require('bcryptjs');

exports.get_login = (request, response, next) => {
    let info = request.session.info ? request.session.info : '';
    request.session.info = '';
    response.render('login', {
        info: info,
        permisos: request.session.permisos,
    });
}

exports.post_login = (request, response, next) => {
    Usuario.fetchOne(request.body.username)
    .then(([usuario, fieldData])=>{
        if (usuario.length < 1) {
            request.session.info = 'El usuario y/o contraseña son incorrectos';
            response.redirect('/user/login');
        } else {
            bcrypt.compare(request.body.password, usuario[0].contraseña)
                .then(doMatch => {
                    if (doMatch) {
                        request.session.isLoggedIn = true;
                        request.session.username = usuario[0].usuario;
                        Usuario.getPermisos(request.body.username).then(([permisos, fieldData])=>{
                            request.session.permisos = new Array();
                            for (let permiso of permisos){
                                request.session.permisos.push(permiso.nombre);
                            }
                            return request.session.save(err => {
                                response.redirect('/incidencias/');
                            });
                        }).catch(err => console.log(err));

                    } else {
                        request.session.info = 'El usuario y/o contraseña son incorrectos';
                        response.redirect('/user/login');
                    }
                    
                }).catch(err => {
                    response.redirect('/user/login');
                });
        }
    })
    .catch((error)=>{
        console.log(error);
    });


    /* request.session.username = request.body.username;
    request.session.isLoggedIn = true;
    response.status(302).redirect('/'); */
}

exports.get_logout = (request, response, next) => {
    request.session.destroy(() => {
        response.redirect('/');
    });
}