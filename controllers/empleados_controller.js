const path = require('path');
const Unidad = require('../models/unidad.model.js');
const Usuario = require('../models/usuario.model.js'); 
const Tipofalla = require('../models/tipofalla.model');

exports.get_root = (request, response, next) => {
    let info = request.session.info ? request.session.info : '';
    request.session.info = '';
    Usuario.fetchRol().then(([roles, fieldData])=>{
        Usuario.fetchEmpleados().then(([empleados, fieldData])=>{
            Usuario.fetchClientes().then(([clientes, fieldData])=>{
                Tipofalla.fetchAll().then(([tipofallas, fieldData3])=>{
                    response.render(path.join('empleados','empleados.ejs'),{
                        empleados: empleados,
                        roles: roles,
                        clientes: clientes,
                        tipofallas: tipofallas,
                        permisos: request.session.permisos,
                        info: info,
                        user: request.session.username,
                    });
                }).catch((error)=>{
                    console.log(error);
                });
            }).catch((error)=>{
                console.log(error);
            });
        }).catch((error)=>{
            console.log(error);
        });
    }).catch((error)=>{
        console.log(error);
    });
};

exports.post_new = (request,response,next) => {
    const usuario = new Usuario(request.body.usuario, request.body.contraseña);
    usuario.save(request.body.rol).then(()=>{
        response.redirect('/empleados');
    }).catch((error)=>{
        console.log(error);
        console.log("catch");
        request.session.info = 'El nombre de usuario no esta disponible';
        response.redirect('/empleados');
    });  
}

exports.get_delete = (request, response, next) => {
    Usuario.deleteEmpleado(request.params.usuario)
        .then( ([rows, fieldData]) => {
                response.redirect('/empleados')
            })
        .catch( (error) => {
            console.log(error);
    });
}